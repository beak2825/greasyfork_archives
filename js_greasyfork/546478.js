// ==UserScript==
// @name        OBG-Estado de patio para almacenes
// @description Permite visualizar las unidades reportadas, registrar comentarios y razón de rechazo
// @namespace   CBI_P44_Plugins
// @version     3.2.2
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/asset/trailer_listing
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/546478/OBG-Estado%20de%20patio%20para%20almacenes.user.js
// @updateURL https://update.greasyfork.org/scripts/546478/OBG-Estado%20de%20patio%20para%20almacenes.meta.js
// ==/UserScript==
 
(function() {
  // Variables to store authorization and cookie information
  let authorization = '';
  let cookieValue = '';
  let yardData = [];
  let taskData = []; // Store task data
  let carrierData = []; // Store carrier data
  let modalCreated = false;
  let refreshIntervalId = null;
  let taskRefreshIntervalId = null;
  let trailerCheckIntervalId = null;
  let sortConfig = { column: null, direction: 'asc' };
  let filters = {};
  let appointmentCache = {}; // Cache appointment data to reduce API calls
  let statusBar = null;
  let loadingPercentage = 0;
 
  // Status bar management
  function createStatusBar() {
    if (statusBar) return;
    
    statusBar = document.createElement('div');
    statusBar.id = 'yard-status-bar';
    statusBar.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      width: 400px;
      height: 40px;
      background-color: #f0f0f0;
      border: 2px solid #4185f4;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: block;
      visibility: visible;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #4185f4);
      width: 0%;
      transition: width 0.3s ease;
      border-radius: 18px;
    `;
    
    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #333;
      font-size: 14px;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
      z-index: 100000;
    `;
    progressText.textContent = 'Inicializando...';
    
    statusBar.appendChild(progressBar);
    statusBar.appendChild(progressText);
    document.body.appendChild(statusBar);
    
    // Force display
    setTimeout(() => {
      statusBar.style.display = 'block';
      statusBar.style.visibility = 'visible';
    }, 100);
  }
 
  function updateStatusBar(percentage, text) {
    if (!statusBar) createStatusBar();
    
    // Force the status bar to be visible and in front
    statusBar.style.display = 'block';
    statusBar.style.visibility = 'visible';
    statusBar.style.zIndex = '99999';
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = text || 'Cargando... ' + percentage + '%';
    
    if (percentage >= 100) {
      setTimeout(() => {
        statusBar.style.display = 'none';
        statusBar.style.visibility = 'hidden';
      }, 3000);
    }
  }
 
  function showStatusBar() {
    if (!statusBar) createStatusBar();
    statusBar.style.display = 'block';
    statusBar.style.visibility = 'visible';
    statusBar.style.zIndex = '99999';
  }
 
  function hideStatusBar() {
    if (statusBar) {
      statusBar.style.display = 'none';
      statusBar.style.visibility = 'hidden';
    }
  }
 
  // Function to determine status based on conditions
  function determineStatus(item) {
    const folio = item.trailer?.shipment_details?.reference_1 || '';
    const carrier = (item.cab?.carrier || '').toUpperCase();
    const serviceType = (item.trailer?.service_type || '').toUpperCase();
    
    // Get task times
    const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
    const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
    const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
    const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
    
    // Get notification time
    const notificationTime = extractNotificationTime(item);
    
    // Check conditions in order of priority
    if ((carrier === 'LEYVA' || carrier === 'LYV') && !folio) {
      return 'MOVIMIENTO INTERNO';
    }
    
    if (exitRampTime) {
      return 'SALIENDO';
    }
    
    if (endLoadingTime) {
      if (serviceType === 'INBOUND') {
        return 'TERMINÓ DESCARGA';
      } else if (serviceType === 'OUTBOUND') {
        return 'TERMINÓ CARGA';
      }
    }
    
    if (arrivalToRampTime) {
      if (serviceType === 'INBOUND') {
        return 'DESCARGANDO';
      } else if (serviceType === 'OUTBOUND') {
        return 'CARGANDO';
      }
    }
    
    if (ingressTime) {
      return 'EN CAMINO A RAMPA';
    }
    
    if (notificationTime) {
      return 'PERFILANDO';
    }
    
    return 'EN ESPERA';
  }
 
  // Get row color based on status
  function getRowColorByStatus(status) {
    switch(status) {
      case 'MOVIMIENTO INTERNO':
        return '#e3f2fd'; // Light blue
      case 'SALIENDO':
        return '#e8f5e9'; // Light green
      case 'TERMINÓ DESCARGA':
      case 'TERMINÓ CARGA':
        return '#fff3e0'; // Light orange
      case 'DESCARGANDO':
      case 'CARGANDO':
        return '#fce4ec'; // Light pink
      case 'EN CAMINO A RAMPA':
        return '#f3e5f5'; // Light purple
      case 'PERFILANDO':
        return '#fff8e1'; // Light yellow
      case 'EN ESPERA':
        return '#ffebee'; // Light red
      default:
        return '#f5f5f5'; // Light gray
    }
  }
 
  // Format Unix timestamp to day/month HH:MM
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + 
           String(date.getHours()).padStart(2, '0') + ':' + 
           String(date.getMinutes()).padStart(2, '0');
  }
 
  // Calculate time difference between two timestamps and return formatted string
  function calculateTimeDifference(timestamp1, timestamp2) {
    if (!timestamp1 || !timestamp2) return '';
    
    const diff = Math.abs(timestamp1 - timestamp2);
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)));
    
    return String(hours).padStart(2, '0') + ':' + 
           String(minutes).padStart(2, '0');
  }
 
  // Calculate time difference with current time and return formatted string with appropriate emoji
  function calculateDwellTime(timestamp) {
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)));
    
    const formattedTime = String(hours).padStart(2, '0') + ':' + 
                         String(minutes).padStart(2, '0') + ':' + 
                         String(seconds).padStart(2, '0');
    
    let emoji = '';
    if (diff < 30 * 60 * 1000) { // less than 30 mins
      emoji = '😊';
    } else if (diff < 60 * 60 * 1000) { // less than 1 hour
      emoji = '😐';
    } else if (diff < 2 * 60 * 60 * 1000) { // less than 2 hours
      emoji = '⚠️';
    } else if (diff < 4 * 60 * 60 * 1000) { // less than 4 hours
      emoji = '⛔';
    } else { // more than 4 hours
      emoji = '💀';
    }
    
    return formattedTime + ' ' + emoji;
  }
 
  // Get latest task time by type and stage for a specific asset
  function getTaskTimeForAsset(uuid, taskType, timeField) {
    if (!taskData || !taskData.length || !uuid) return null;
    
    // Filter tasks by asset UUID and task type
    const relevantTasks = taskData.filter(task => {
      return task.task_type.code === taskType && 
             task.assets && 
             task.assets.some(asset => asset.uuid === uuid);
    });
    
    if (!relevantTasks.length) return null;
    
    // Sort by the specified time field in descending order
    relevantTasks.sort((a, b) => {
      const timeA = a[timeField] || 0;
      const timeB = b[timeField] || 0;
      return timeB - timeA;  // Most recent first
    });
    
    // Return the time from the most recent task
    return relevantTasks[0][timeField];
  }
 
  // Function to fetch carrier data
  function fetchCarrierData() {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      console.log("Fetching carrier data...");
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      
      fetch('https://yard-visibility-na12.api.project44.com/v1/carrier/list?size=1000', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Carrier API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Carrier data fetched successfully", { items: data.data?.length || 0 });
        
        if (!data.data) {
          console.log("API response missing data property", data);
          reject(new Error("API response missing data property"));
          return;
        }
        
        carrierData = data.data || [];
        resolve(carrierData);
      })
      .catch(error => {
        console.log("Error fetching carrier data:", error.message);
        console.error("Error fetching carrier data:", error);
        reject(error);
      });
    });
  }
 
  // Function to get carrier name by SCAC
  function getCarrierName(scac) {
    if (!scac || !carrierData.length) return scac || '';
    
    // First, try direct match
    let carrier = carrierData.find(c => c.scac.toLowerCase() === scac.toLowerCase());
    if (carrier) {
      // If the name is 3 characters, look for one with 0 prefix
      if (carrier.name.length === 3) {
        const prefixedCarrier = carrierData.find(c => c.scac.toLowerCase() === ('0' + carrier.name).toLowerCase());
        if (prefixedCarrier) {
          return prefixedCarrier.name;
        }
      }
      return carrier.name;
    }
    
    // If no direct match found, return the original SCAC
    return scac;
  }
 
  // Function to fetch task data
  function fetchTaskData() {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      console.log("Fetching task data...");
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      
      fetch('https://yard-visibility-na12.api.project44.com/v1/task-search?page_no=1&size=1000&site=obregon', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Task API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Task data fetched successfully", { items: data.data?.length || 0 });
        
        if (!data.data) {
          console.log("API response missing data property", data);
          reject(new Error("API response missing data property"));
          return;
        }
        
        taskData = data.data || [];
        resolve(taskData);
      })
      .catch(error => {
        console.log("Error fetching task data:", error.message);
        console.error("Error fetching task data:", error);
        reject(error);
      });
    });
  }
 
  // Get appointment data for a trailer
  function fetchAppointmentData(shipmentNo) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      // Check if we have cached data
      if (appointmentCache[shipmentNo]) {
        resolve(appointmentCache[shipmentNo]);
        return;
      }
      
      console.log('Fetching appointment data for shipment ' + shipmentNo);
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      
      fetch('https://yard-visibility-na12.api.project44.com/v1/gate/console/search?event_move=arrival&search_term=' + shipmentNo + '&location_type=gate&screen=gate_console&site=obregon', {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Appointment data received for shipment ' + shipmentNo, data);
        
        // Process and cache the data
        if (data.data && data.data.length > 0) {
          const appointmentData = {
            appointmentTime: data.data[0].appointment_information?.appointment_time || null,
            sectionName: data.data[0].appointment_information?.section_name || ''
          };
          
          // Cache the result
          appointmentCache[shipmentNo] = appointmentData;
          resolve(appointmentData);
        } else {
          // Empty result
          appointmentCache[shipmentNo] = { appointmentTime: null, sectionName: '' };
          resolve(appointmentCache[shipmentNo]);
        }
      })
      .catch(error => {
        console.log('Error fetching appointment data for shipment ' + shipmentNo + ':', error.message);
        reject(error);
      });
    });
  }
 
  // Extract notification time from the comment field
  function extractNotificationTime(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<sc>(\d+)<\/sc>/);
      if (trailerMatch) return parseInt(trailerMatch[1]);
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<sc>(\d+)<\/sc>/);
      if (match) return parseInt(match[1]);
    }
    
    return null;
  }
 
  // Extract security incident comment from the comment field
  function extractSecurityIncident(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<x>(.*?)<\/x>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<x>(.*?)<\/x>/);
      if (match) return match[1];
    }
    
    return null;
  }

  // Extract warehouse incident from the comment field
  function extractWarehouseIncident(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<y>(.*?)<\/y>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<y>(.*?)<\/y>/);
      if (match) return match[1];
    }
    
    return null;
  }

  // Extract rejection reason from the comment field
  function extractRejectionReason(item) {
    if (!item) return null;
    
    // Check for comment in trailer object first
    if (item.trailer && item.trailer.comment) {
      const trailerMatch = item.trailer.comment.match(/<rr>(.*?)<\/rr>/);
      if (trailerMatch) return trailerMatch[1];
    }
    
    // Then check for comment in the main object
    if (item.comment) {
      const match = item.comment.match(/<rr>(.*?)<\/rr>/);
      if (match) return match[1];
    }
    
    return null;
  }
 
  // Send notification for a trailer
  function sendNotification(item) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid);
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        const currentTimestamp = Date.now();
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the notification timestamp to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add the timestamp to the comment
        if (comment.includes('<sc>')) {
          // Replace existing timestamp
          comment = comment.replace(/<sc>.*?<\/sc>/, '<sc>' + currentTimestamp + '</sc>');
        } else {
          // Add new timestamp
          comment = comment + '<sc>' + currentTimestamp + '</sc>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the timestamp
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending notification update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Notification sent for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          const currentTimestamp = Date.now();
          
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<sc>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<sc>.*?<\/sc>/, 
                '<sc>' + currentTimestamp + '</sc>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<sc>' + currentTimestamp + '</sc>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<sc>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<sc>.*?<\/sc>/, 
                '<sc>' + currentTimestamp + '</sc>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<sc>' + currentTimestamp + '</sc>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error sending notification for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }
 
  // Add or update security incident for a trailer
  function updateSecurityIncident(item, incidentText) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid + ' to update security incident');
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the security incident to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add or update the security incident in the comment
        if (comment.includes('<x>')) {
          // Replace existing security incident
          comment = comment.replace(/<x>.*?<\/x>/, '<x>' + incidentText + '</x>');
        } else {
          // Add new security incident
          comment = comment + '<x>' + incidentText + '</x>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the security incident
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending security incident update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Security incident updated for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<x>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<x>.*?<\/x>/, 
                '<x>' + incidentText + '</x>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<x>' + incidentText + '</x>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<x>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<x>.*?<\/x>/, 
                '<x>' + incidentText + '</x>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<x>' + incidentText + '</x>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error updating security incident for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }

  // Add or update warehouse incident for a trailer
  function updateWarehouseIncident(item, incidentText) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid + ' to update warehouse incident');
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the warehouse incident to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add or update the warehouse incident in the comment
        if (comment.includes('<y>')) {
          // Replace existing warehouse incident
          comment = comment.replace(/<y>.*?<\/y>/, '<y>' + incidentText + '</y>');
        } else {
          // Add new warehouse incident
          comment = comment + '<y>' + incidentText + '</y>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the warehouse incident
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending warehouse incident update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Warehouse incident updated for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<y>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<y>.*?<\/y>/, 
                '<y>' + incidentText + '</y>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<y>' + incidentText + '</y>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<y>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<y>.*?<\/y>/, 
                '<y>' + incidentText + '</y>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<y>' + incidentText + '</y>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error updating warehouse incident for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }

  // Add or update rejection reason for a trailer
  function updateRejectionReason(item, rejectionText) {
    return new Promise((resolve, reject) => {
      if (!authorization || !cookieValue) {
        reject(new Error("Authorization or Cookie not captured yet."));
        return;
      }
      
      if (!item || !item.uuid) {
        reject(new Error("Invalid item data"));
        return;
      }
      
      console.log('Fetching asset details for UUID ' + item.uuid + ' to update rejection reason');
      
      // Create request headers
      const headers = new Headers();
      headers.append('Authorization', authorization);
      headers.append('Cookie', cookieValue);
      headers.append('Content-Type', 'application/json');
      
      // First, get the current asset data
      fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Asset details received for UUID ' + item.uuid, data);
        
        // Create a new payload with the structure needed for the PUT request
        let updatePayload = { ...data }; // Create a copy of the base data
        
        // Add the rejection reason to the comment
        let comment = '';
        
        // If comment exists in trailer, use that, otherwise use the main comment if it exists
        if (data.trailer && data.trailer.comment) {
          comment = data.trailer.comment;
        } else if (data.comment) {
          comment = data.comment;
        }
        
        // Add or update the rejection reason in the comment
        if (comment.includes('<rr>')) {
          // Replace existing rejection reason
          comment = comment.replace(/<rr>.*?<\/rr>/, '<rr>' + rejectionText + '</rr>');
        } else {
          // Add new rejection reason
          comment = comment + '<rr>' + rejectionText + '</rr>';
        }
        
        // Set trailer to empty string as in the example
        updatePayload.trailer = '';
        
        // Move trailer properties to the main object
        if (data.trailer && typeof data.trailer === 'object') {
          // Add all trailer properties to the main object
          Object.keys(data.trailer).forEach(key => {
            updatePayload[key] = data.trailer[key];
          });
        }
        
        // Set the comment with the rejection reason
        updatePayload.comment = comment;
        
        // Add other required properties shown in the example
        updatePayload.assignedSiteFlag = false;
        updatePayload.maintenance = {};
        updatePayload.rental = {};
        updatePayload.seal1_intact = false;
        updatePayload.seal2_intact = false;
        updatePayload.seal2 = '';
        updatePayload.rfid = '';
        
        console.log('Sending rejection reason update for UUID ' + item.uuid);
        
        // Send the update with the transformed structure
        return fetch('https://yard-visibility-na12.api.project44.com/v1/asset/' + item.uuid, {
          method: 'PUT',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(updatePayload)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Update API responded with status ' + response.status);
        }
        return response.json();
      })
      .then(result => {
        console.log('Rejection reason updated for UUID ' + item.uuid, result);
        
        // Update the item in our local data
        const itemIndex = yardData.findIndex(i => i.uuid === item.uuid);
        if (itemIndex !== -1) {
          // Update the comment in our local data structure
          if (yardData[itemIndex].trailer && yardData[itemIndex].trailer.comment) {
            if (yardData[itemIndex].trailer.comment.includes('<rr>')) {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment.replace(
                /<rr>.*?<\/rr>/, 
                '<rr>' + rejectionText + '</rr>'
              );
            } else {
              yardData[itemIndex].trailer.comment = yardData[itemIndex].trailer.comment + '<rr>' + rejectionText + '</rr>';
            }
          } 
          else if (yardData[itemIndex].comment) {
            if (yardData[itemIndex].comment.includes('<rr>')) {
              yardData[itemIndex].comment = yardData[itemIndex].comment.replace(
                /<rr>.*?<\/rr>/, 
                '<rr>' + rejectionText + '</rr>'
              );
            } else {
              yardData[itemIndex].comment = yardData[itemIndex].comment + '<rr>' + rejectionText + '</rr>';
            }
          }
        }
        
        // Update the table
        updateTable();
        resolve(result);
      })
      .catch(error => {
        console.log('Error updating rejection reason for UUID ' + item.uuid + ':', error.message);
        reject(error);
      });
    });
  }

  // Show rejection modal with dropdown options
  function showRejectionModal(item) {
    // Create modal background
    const modalBg = document.createElement('div');
    modalBg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 20000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    // Modal title
    const title = document.createElement('h3');
    title.textContent = 'SELECCIONAR MOTIVO DE RECHAZO';
    title.style.cssText = 'margin: 0 0 20px 0; text-align: center; color: #333;';

    // Create select element
    const select = document.createElement('select');
    select.style.cssText = `
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background-color: white;
    `;

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'SELECCIONAR MOTIVO...';
    select.appendChild(defaultOption);

    // Define rejection options
    const rejectionOptions = [
      'R1-RECHAZO ALARMA DE REVERSA',
      'R1-RECHAZO CHALECO',
      'R1-RECHAZO CORTINAS',
      'R1-RECHAZO DUELAS DAÑADAS DE CAJA',
      'R1-RECHAZO FALLA ELECTRICA',
      'R1-RECHAZO FUGA DE ACEITE',
      'R1-RECHAZO GAFETE',
      'R1-RECHAZO LLANTA POCHADA',
      'R1-RECHAZO OBJETOS EXTRAÑOS',
      'R1-RECHAZO OPERADOR VETADO',
      'R1-RECHAZO PANTALON ROTO',
      'R1-RECHAZO POR ACOMPAÑANTE',
      'R1-RECHAZO POR ARRANQUE',
      'R1-RECHAZO POR FALTA SPOT (TAREAS)',
      'R1-RECHAZO POR LLEGAR TARDE AL AREA',
      'R1-RECHAZO POR LUCES',
      'R1-RECHAZO POR PUERTAS',
      'R1-RECHAZO POR SELLOS',
      'R1-RECHAZO POR ZAPATOS DE SEGURIDAD',
      'R1-RECHAZO POSITIVO DOPING',
      'R1-RECHAZOS POR BOLSAS DE AIRE',
      'R1-RECHAZO POR ALMACEN ERRONEO',
      'R2-RECHAZO ALMACEN LLENO',
      'R2-RECHAZO PAPELERIA ERRONEA',
      'R2-RECHAZO POR AIRE (CLIMA)',
      'R2-RECHAZO POR FALLA DE RAMPAS',
      'R2-RECHAZO POR LLUVIA',
      'R2-RECHAZO POR MATERIAL DAÑADO',
      'R2-RECHAZO SAP/SYSTORE',
      'R2-RECHAZO MATERIAL COLAPSADO'
    ];

    // Add options to select
    rejectionOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

    // Create confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'CONFIRMAR';
    confirmButton.style.cssText = `
      padding: 10px 20px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    `;
    
    confirmButton.onclick = function() {
      const selectedValue = select.value;
      if (selectedValue) {
        updateRejectionReason(item, selectedValue)
          .then(() => {
            document.body.removeChild(modalBg);
          })
          .catch(err => {
            alert('Error registrando rechazo: ' + err.message);
          });
      } else {
        alert('Por favor seleccione un motivo de rechazo');
      }
    };

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'CANCELAR';
    cancelButton.style.cssText = `
      padding: 10px 20px;
      background-color: #666;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    cancelButton.onclick = function() {
      document.body.removeChild(modalBg);
    };

    // Assemble modal
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(select);
    modalContent.appendChild(buttonsContainer);
    
    modalBg.appendChild(modalContent);
    document.body.appendChild(modalBg);

    // Close modal when clicking outside
    modalBg.onclick = function(e) {
      if (e.target === modalBg) {
        document.body.removeChild(modalBg);
      }
    };
  }
 
  // Export table data to Excel
  function exportToExcel() {
    console.log("Exporting data to Excel");
    
    if (yardData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    
    try {
      // Create a workbook
      const wb = XLSX.utils.book_new();
      
      // Prepare the data
      const excelData = [];
      
      // Add headers (updated to exclude GAFETE and IDENTIFICACIÓN columns)
      const headers = [
        'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
        'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
        'Teléfono operador', 'Económico tracto', 'Económico trailer', 
        'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
        'Diferencia vs. cita', 'Sección cita', 'Aviso enviado', 'Incidente seguridad',
        'Incidente almacén', 'Rechazo', 'Hora de ingreso', 'Hora de llegada a rampa',
        'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status'
      ];
      excelData.push(headers);
      
      // Filter and sort data according to current settings
      const displayData = getFilteredAndSortedData();
      
      // Add data rows
      displayData.forEach(item => {
        const reference1 = item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_1 || '' : '';
        const reference2 = item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_2 || '' : '';
        const status = item.status === 'empty' ? 'VACÍO' : item.status === 'loaded' ? 'CARGADO' : (item.status || '').toUpperCase();
        const commodity = (item.commodity || '').toUpperCase();
        const sku = item.trailer && item.trailer.shipment_details && item.trailer.shipment_details.sku ? 
                    item.trailer.shipment_details.sku.join(', ').toUpperCase() : '';
        const serviceType = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
        const location = (item.current_location || '').toUpperCase();
        const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
        const carrierName = getCarrierName(carrier).toUpperCase();
        const driverName = (item.cab ? 
                          (item.cab.first_name || '') + ' ' + (item.cab.last_name || '').trim() : '').toUpperCase();
        const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
        const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
        const trailerName = (item.name || '').toUpperCase();
        const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
        const timeDifference = calculateDwellTime(item.arrival_time).split(' ')[0].toUpperCase(); // Remove emoji for Excel
        
        // Get appointment data
        const shipmentNo = item.trailer?.shipment_no || '';
        const appointmentInfo = appointmentCache[shipmentNo] || { appointmentTime: null, sectionName: '' };
        const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
        const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                               calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
        const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
        
        // Get notification time
        const notificationTime = extractNotificationTime(item);
        const notificationStatus = notificationTime ? formatTimestamp(notificationTime).toUpperCase() : 'NO ENVIADO';
        
        // Get security incident
        const securityIncident = extractSecurityIncident(item)?.toUpperCase() || '';
        
        // Get warehouse incident
        const warehouseIncident = extractWarehouseIncident(item)?.toUpperCase() || '';
        
        // Get rejection reason
        const rejectionReason = extractRejectionReason(item)?.toUpperCase() || '';
        
        // Get task times
        const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
        const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
        const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
        const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
        
        // Get status
        const itemStatus = determineStatus(item).toUpperCase();
        
        excelData.push([
          reference1.toUpperCase(), 
          reference2.toUpperCase(), 
          status, 
          commodity, 
          sku, 
          serviceType, 
          location,
          carrier,
          carrierName, 
          driverName, 
          driverPhone, 
          cabNo, 
          trailerName, 
          arrivalTime, 
          timeDifference,
          appointmentTime, 
          appointmentDiff, 
          sectionName, 
          notificationStatus, 
          securityIncident,
          warehouseIncident,
          rejectionReason,
          ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '',
          arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '',
          endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '',
          exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '',
          itemStatus
        ]);
      });
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Datos de Patio");
      
      // Generate Excel file and trigger download
      const fileName = 'datos_patio_' + new Date().toISOString().split('T')[0] + '.xlsx';
      XLSX.writeFile(wb, fileName);
      
      console.log("Excel export completed", { rows: excelData.length - 1 });
    } catch (error) {
      console.log("Error exporting to Excel:", error.message);
      
      // If XLSX is not loaded, try using a simpler CSV approach
      if (typeof XLSX === 'undefined') {
        exportToCSV();
      } else {
        alert("Error al exportar: " + error.message);
      }
    }
  }
  
  // Fallback CSV export
  function exportToCSV() {
    console.log("Fallback to CSV export");
    
    try {
      // Prepare the data
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers (updated to exclude GAFETE and IDENTIFICACIÓN columns)
      const headers = [
        'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
        'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
        'Teléfono operador', 'Económico tracto', 'Económico trailer', 
        'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
        'Diferencia vs. cita', 'Sección cita', 'Aviso enviado', 'Incidente seguridad',
        'Incidente almacén', 'Rechazo', 'Hora de ingreso', 'Hora de llegada a rampa',
        'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status'
      ];
      csvContent += headers.join(",") + "\r\n";
      
      // Filter and sort data according to current settings
      const displayData = getFilteredAndSortedData();
      
      // Add data rows
      displayData.forEach(item => {
        const reference1 = item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_1 || '' : '';
        const reference2 = item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_2 || '' : '';
        const status = item.status === 'empty' ? 'VACÍO' : item.status === 'loaded' ? 'CARGADO' : (item.status || '').toUpperCase();
        const commodity = (item.commodity || '').toUpperCase();
        const sku = item.trailer && item.trailer.shipment_details && item.trailer.shipment_details.sku ? 
                    item.trailer.shipment_details.sku.join(', ').replace(/,/g, ' -').toUpperCase() : '';
        const serviceType = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
        const location = (item.current_location || '').toUpperCase();
        const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
        const carrierName = getCarrierName(carrier).toUpperCase();
        const driverName = (item.cab ? 
                          ((item.cab.first_name || '') + ' ' + (item.cab.last_name || '')).trim() : '').toUpperCase();
        const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
        const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
        const trailerName = (item.name || '').toUpperCase();
        const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
        const timeDifference = calculateDwellTime(item.arrival_time).split(' ')[0].toUpperCase(); // Remove emoji
        
        // Get appointment data
        const shipmentNo = item.trailer?.shipment_no || '';
        const appointmentInfo = appointmentCache[shipmentNo] || { appointmentTime: null, sectionName: '' };
        const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
        const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                               calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
        const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
        
        // Get notification time
        const notificationTime = extractNotificationTime(item);
        const notificationStatus = notificationTime ? formatTimestamp(notificationTime).toUpperCase() : 'NO ENVIADO';
        
        // Get security incident
        const securityIncident = extractSecurityIncident(item)?.toUpperCase() || '';
        
        // Get warehouse incident
        const warehouseIncident = extractWarehouseIncident(item)?.toUpperCase() || '';
        
        // Get rejection reason
        const rejectionReason = extractRejectionReason(item)?.toUpperCase() || '';
        
        // Get task times
        const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
        const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
        const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
        const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
        
        // Get status
        const itemStatus = determineStatus(item).toUpperCase();
        
        const row = [
          reference1.toUpperCase(), 
          reference2.toUpperCase(), 
          status, 
          commodity, 
          sku, 
          serviceType, 
          location,
          carrier,
          carrierName, 
          driverName, 
          driverPhone, 
          cabNo, 
          trailerName, 
          arrivalTime, 
          timeDifference,
          appointmentTime, 
          appointmentDiff, 
          sectionName, 
          notificationStatus, 
          securityIncident,
          warehouseIncident,
          rejectionReason,
          ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '',
          arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '',
          endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '',
          exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '',
          itemStatus
        ].map(val => '"' + String(val).replace(/"/g, '""') + '"').join(',');
        
        csvContent += row + "\r\n";
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", 'datos_patio_' + new Date().toISOString().split('T')[0] + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("CSV export completed");
    } catch (error) {
      console.log("Error exporting to CSV:", error.message);
      alert("Error al exportar: " + error.message);
    }
  }
 
  // Load XLSX library if not present
  function loadXLSXLibrary() {
    if (typeof XLSX !== 'undefined') {
      console.log("XLSX library already loaded");
      return Promise.resolve();
    }
    
    console.log("Loading XLSX library");
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.onload = () => {
        console.log("XLSX library loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.log("Failed to load XLSX library");
        reject(new Error("Failed to load Excel export library"));
      };
      document.head.appendChild(script);
    });
  }
 
  // Make API request to get yard data
  function fetchYardData(manualFetch = false) {
    if (!authorization || !cookieValue) {
      console.log("Authorization or Cookie not captured yet. Cannot fetch data.", { auth: !!authorization, cookie: !!cookieValue });
      return;
    }
    
    updateStatusBar(10, 'Iniciando carga de datos...');
    console.log("Fetching yard data...");
    
    // Create request headers
    const headers = new Headers();
    headers.append('Authorization', authorization);
    headers.append('Cookie', cookieValue);
    
    console.log("Request headers prepared", {
      Authorization: authorization.substring(0, 20) + '...',
      Cookie: cookieValue.substring(0, 20) + '...'
    });
    
    // Fetch yard data
    const yardDataPromise = fetch('https://yard-visibility-na12.api.project44.com/v1/asset/search?page_no=1&size=1000&assetClass=trailer&in_yard=true&site=obregon', {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
    .then(response => {
      updateStatusBar(30, 'Datos del patio obtenidos...');
      console.log('Response status: ' + response.status);
      if (!response.ok) {
        throw new Error('API responded with status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Data fetched successfully", { items: data.data?.length || 0 });
      
      // Check if data has the expected format
      if (!data.data) {
        console.log("API response missing data property", data);
        throw new Error("API response missing data property");
      }
      
      yardData = data.data || [];
      return yardData;
    });
    
    // Fetch task data
    const taskDataPromise = fetchTaskData().then(() => {
      updateStatusBar(50, 'Datos de tareas obtenidos...');
    });
    
    // Fetch carrier data
    const carrierDataPromise = fetchCarrierData().then(() => {
      updateStatusBar(70, 'Datos de transportistas obtenidos...');
    });
    
    // Wait for all promises to complete
    Promise.all([yardDataPromise, taskDataPromise, carrierDataPromise])
      .then(([yardResult]) => {
        updateStatusBar(80, 'Obteniendo datos de citas...');
        console.log("All data fetched, yard data: " + yardData.length + ", task data: " + taskData.length + ", carrier data: " + carrierData.length);
        
        // For each item, fetch appointment data if we have a shipment number
        const appointmentPromises = [];
        
        yardData.forEach(item => {
          const shipmentNo = item.trailer?.shipment_no;
          if (shipmentNo && !appointmentCache[shipmentNo]) {
            appointmentPromises.push(
              fetchAppointmentData(shipmentNo)
                .catch(err => {
                  console.log('Error fetching appointment for ' + shipmentNo + ':', err.message);
                  return { appointmentTime: null, sectionName: '' };
                })
            );
          }
        });
        
        // Wait for all appointment data to be fetched
        if (appointmentPromises.length > 0) {
          console.log('Fetching ' + appointmentPromises.length + ' appointment records...');
          
          Promise.allSettled(appointmentPromises)
            .then(() => {
              updateStatusBar(100, 'Datos cargados completamente');
              console.log("All appointment data fetched");
              updateTable();
            });
        } else {
          updateStatusBar(100, 'Datos cargados completamente');
          updateTable();
        }
      })
      .catch(error => {
        updateStatusBar(100, 'Error en la carga');
        console.log("Error in data fetching: ", error.message);
        console.error("Error in data fetching: ", error);
        
        // If yard data exists but other data fails, still update the table
        if (yardData.length > 0) {
          updateTable();
        }
      });
  }
 
  // Sort data based on current sort configuration
  function sortData(data) {
    if (!sortConfig.column) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      // Extract values based on column (updated for new column structure)
      switch(sortConfig.column) {
        case 0: // Folio
          aValue = a.trailer?.shipment_details?.reference_1 || '';
          bValue = b.trailer?.shipment_details?.reference_1 || '';
          break;
        case 1: // Entrega
          aValue = a.trailer?.shipment_details?.reference_2 || '';
          bValue = b.trailer?.shipment_details?.reference_2 || '';
          break;
        case 2: // Estado
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 3: // Material
          aValue = a.commodity || '';
          bValue = b.commodity || '';
          break;
        case 4: // Descripción
          aValue = a.trailer?.shipment_details?.sku?.join(', ') || '';
          bValue = b.trailer?.shipment_details?.sku?.join(', ') || '';
          break;
        case 5: // Tipo
          aValue = a.trailer?.service_type || '';
          bValue = b.trailer?.service_type || '';
          break;
        case 6: // Ubicación actual
          aValue = a.current_location || '';
          bValue = b.current_location || '';
          break;
        case 7: // Linea
          aValue = a.cab?.carrier || '';
          bValue = b.cab?.carrier || '';
          break;
        case 8: // Nombre Linea
          aValue = getCarrierName(a.cab?.carrier || '');
          bValue = getCarrierName(b.cab?.carrier || '');
          break;
        case 9: // Nombre operador
          aValue = ((a.cab?.first_name || '') + ' ' + (a.cab?.last_name || '')).trim();
          bValue = ((b.cab?.first_name || '') + ' ' + (b.cab?.last_name || '')).trim();
          break;
        case 10: // Teléfono operador
          aValue = a.cab?.driver_cell_no || '';
          bValue = b.cab?.driver_cell_no || '';
          break;
        case 11: // Económico tracto
          aValue = a.cab?.cab_no || '';
          bValue = b.cab?.cab_no || '';
          break;
        case 12: // Económico trailer
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 13: // Hora reportado
          aValue = a.arrival_time || 0;
          bValue = b.arrival_time || 0;
          break;
        case 14: // Tiempo de estancia
          aValue = a.arrival_time || 0;
          bValue = b.arrival_time || 0;
          break;
        case 15: // Fecha de la cita
          const shipmentNoA = a.trailer?.shipment_no || '';
          const shipmentNoB = b.trailer?.shipment_no || '';
          aValue = appointmentCache[shipmentNoA]?.appointmentTime || 0;
          bValue = appointmentCache[shipmentNoB]?.appointmentTime || 0;
          break;
        case 16: // Diferencia vs. cita
          // Sort by absolute difference value
          const shipmentNo1 = a.trailer?.shipment_no || '';
          const shipmentNo2 = b.trailer?.shipment_no || '';
          const apptTimeA = appointmentCache[shipmentNo1]?.appointmentTime || 0;
          const apptTimeB = appointmentCache[shipmentNo2]?.appointmentTime || 0;
          aValue = apptTimeA && a.arrival_time ? Math.abs(apptTimeA - a.arrival_time) : Number.MAX_SAFE_INTEGER;
          bValue = apptTimeB && b.arrival_time ? Math.abs(apptTimeB - b.arrival_time) : Number.MAX_SAFE_INTEGER;
          break;
        case 17: // Sección cita
          const shipmentNoSectionA = a.trailer?.shipment_no || '';
          const shipmentNoSectionB = b.trailer?.shipment_no || '';
          aValue = appointmentCache[shipmentNoSectionA]?.sectionName || '';
          bValue = appointmentCache[shipmentNoSectionB]?.sectionName || '';
          break;
        case 18: // Aviso enviado
          aValue = extractNotificationTime(a) || 0;
          bValue = extractNotificationTime(b) || 0;
          break;
        case 19: // Incidente seguridad
          aValue = extractSecurityIncident(a) || '';
          bValue = extractSecurityIncident(b) || '';
          break;
        case 20: // Incidente almacén
          aValue = extractWarehouseIncident(a) || '';
          bValue = extractWarehouseIncident(b) || '';
          break;
        case 21: // Rechazo
          aValue = extractRejectionReason(a) || '';
          bValue = extractRejectionReason(b) || '';
          break;
        case 22: // Hora de ingreso
          aValue = getTaskTimeForAsset(a.uuid, 'spot', 'created_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'spot', 'created_time') || 0;
          break;
        case 23: // Hora de llegada a rampa
          aValue = getTaskTimeForAsset(a.uuid, 'spot', 'completed_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'spot', 'completed_time') || 0;
          break;
        case 24: // Hora de fin de carga/descarga
          aValue = getTaskTimeForAsset(a.uuid, 'pull', 'created_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'pull', 'created_time') || 0;
          break;
        case 25: // Hora de salida de rampa
          aValue = getTaskTimeForAsset(a.uuid, 'pull', 'completed_time') || 0;
          bValue = getTaskTimeForAsset(b.uuid, 'pull', 'completed_time') || 0;
          break;
        case 26: // Status
          aValue = determineStatus(a);
          bValue = determineStatus(b);
          break;
        default:
          return 0;
      }
      
      // Numeric comparison for numbers
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      // Perform the comparison
      const result = 
        aValue > bValue ? 1 :
        aValue < bValue ? -1 : 0;
        
      // Reverse if direction is descending
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }
 
  // Filter data based on current filter values
  function filterData(data) {
    return data.filter(item => {
      for (const columnIndex in filters) {
        if (!filters[columnIndex] || filters[columnIndex] === '') continue;
        
        const filterText = filters[columnIndex].toLowerCase();
        let itemValue = '';
        
        // Extract values based on column (updated for new column structure)
        switch(parseInt(columnIndex)) {
          case 0: // Folio
            itemValue = item.trailer?.shipment_details?.reference_1 || '';
            break;
          case 1: // Entrega
            itemValue = item.trailer?.shipment_details?.reference_2 || '';
            break;
          case 2: // Estado
            itemValue = item.status === 'empty' ? 'vacío' : item.status === 'loaded' ? 'cargado' : item.status || '';
            break;
          case 3: // Material
            itemValue = item.commodity || '';
            break;
          case 4: // Descripción
            itemValue = item.trailer?.shipment_details?.sku?.join(', ') || '';
            break;
          case 5: // Tipo
            itemValue = item.trailer?.service_type || '';
            break;
          case 6: // Ubicación actual
            itemValue = item.current_location || '';
            break;
          case 7: // Linea
            itemValue = item.cab?.carrier || '';
            break;
          case 8: // Nombre Linea
            itemValue = getCarrierName(item.cab?.carrier || '');
            break;
          case 9: // Nombre operador
            itemValue = ((item.cab?.first_name || '') + ' ' + (item.cab?.last_name || '')).trim();
            break;
          case 10: // Teléfono operador
            itemValue = item.cab?.driver_cell_no || '';
            break;
          case 11: // Económico tracto
            itemValue = item.cab?.cab_no || '';
            break;
          case 12: // Económico trailer
            itemValue = item.name || '';
            break;
          case 13: // Hora reportado
            itemValue = formatTimestamp(item.arrival_time);
            break;
          case 14: // Tiempo de estancia
            itemValue = calculateDwellTime(item.arrival_time).split(' ')[0]; // Remove emoji
            break;
          case 15: // Fecha de la cita
            const shipmentNo = item.trailer?.shipment_no || '';
            const apptTime = appointmentCache[shipmentNo]?.appointmentTime;
            itemValue = apptTime ? formatTimestamp(apptTime) : '';
            break;
          case 16: // Diferencia vs. cita
            const shipmentNoDiff = item.trailer?.shipment_no || '';
            const apptTimeDiff = appointmentCache[shipmentNoDiff]?.appointmentTime;
            itemValue = (apptTimeDiff && item.arrival_time) ? 
                       calculateTimeDifference(item.arrival_time, apptTimeDiff) : '';
            break;
          case 17: // Sección cita
            const shipmentNoSection = item.trailer?.shipment_no || '';
            itemValue = appointmentCache[shipmentNoSection]?.sectionName || '';
            break;
          case 18: // Aviso enviado
            const notificationTime = extractNotificationTime(item);
            itemValue = notificationTime ? formatTimestamp(notificationTime) : 'No enviado';
            break;
          case 19: // Incidente seguridad
            itemValue = extractSecurityIncident(item) || '';
            break;
          case 20: // Incidente almacén
            itemValue = extractWarehouseIncident(item) || '';
            break;
          case 21: // Rechazo
            itemValue = extractRejectionReason(item) || '';
            break;
          case 22: // Hora de ingreso
            const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
            itemValue = ingressTime ? formatTimestamp(ingressTime) : '';
            break;
          case 23: // Hora de llegada a rampa
            const arrivalTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
            itemValue = arrivalTime ? formatTimestamp(arrivalTime) : '';
            break;
          case 24: // Hora de fin de carga/descarga
            const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
            itemValue = endLoadingTime ? formatTimestamp(endLoadingTime) : '';
            break;
          case 25: // Hora de salida de rampa
            const exitTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
            itemValue = exitTime ? formatTimestamp(exitTime) : '';
            break;
          case 26: // Status
            itemValue = determineStatus(item);
            break;
          default:
            itemValue = '';
        }
        
        if (!itemValue.toLowerCase().includes(filterText)) {
          return false;
        }
      }
      
      return true;
    });
  }
 
  // Get data that is both filtered and sorted
  function getFilteredAndSortedData() {
    const filtered = filterData(yardData);
    return sortData(filtered);
  }
 
  // Create button at the top of the page
  function createButton() {
    const button = document.createElement('button');
    button.id = 'console-button';
    button.textContent = 'Consola de Puerta';
    button.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      padding: 10px 15px;
      background-color: #4185f4;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    button.onclick = showConsole;
    document.body.appendChild(button);
    
    console.log('Button created and added to page');
  }
 
  // Update the table with fetched yard data
  function updateTable() {
    if (!modalCreated) {
      console.log("Modal not created yet, skipping table update");
      return;
    }
    
    const tableBody = document.getElementById('yard-table-body');
    if (!tableBody) {
      console.log("Table body element not found");
      return;
    }
    
    console.log('Updating table with ' + yardData.length + ' rows');
    tableBody.innerHTML = '';
    
    if (yardData.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="27" style="text-align: center; padding: 20px;">NO HAY DATOS DISPONIBLES</td>';
      tableBody.appendChild(emptyRow);
      return;
    }
    
    // Get filtered and sorted data
    const displayData = getFilteredAndSortedData();
    
    if (displayData.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="27" style="text-align: center; padding: 20px;">NO HAY RESULTADOS PARA LOS FILTROS ACTUALES</td>';
      tableBody.appendChild(emptyRow);
      return;
    }
    
    displayData.forEach((item, index) => {
      try {
        const row = document.createElement('tr');
        
        // Determine status and set row color based on it
        const itemStatus = determineStatus(item);
        const isCritical = (item.trailer && item.trailer.comment && item.trailer.comment.includes('<critico>')) ||
                           (item.comment && item.comment.includes('<critico>'));
        
        if (isCritical) {
          // Apply vibrant red background and yellow text for critical items
          row.style.backgroundColor = '#ff0000'; // Vibrant red
          row.style.color = '#ffff00'; // Yellow text
          row.style.fontWeight = 'bold';
        } else {
          // Set row color based on status
          row.style.backgroundColor = getRowColorByStatus(itemStatus);
          
          // Alternate row colors slightly for better readability
          if (index % 2 === 1) {
            // Make the background slightly darker
            const currentBg = row.style.backgroundColor || '#ffffff';
            const darkerBg = adjustBrightness(currentBg, -10);
            row.style.backgroundColor = darkerBg;
          }
        }
        
        // Get nested values with safe access
        const reference1 = (item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_1 || '' : '').toUpperCase();
        const reference2 = (item.trailer && item.trailer.shipment_details ? item.trailer.shipment_details.reference_2 || '' : '').toUpperCase();
        const statusText = (item.status === 'empty' ? 'Vacío' : item.status === 'loaded' ? 'Cargado' : item.status || '').toUpperCase();
        const commodity = (item.commodity || '').toUpperCase();
        const sku = (item.trailer && item.trailer.shipment_details && item.trailer.shipment_details.sku ? 
                    item.trailer.shipment_details.sku.join(', ') : '').toUpperCase();
        const serviceTypeText = (item.trailer ? item.trailer.service_type || '' : '').toUpperCase();
        const location = (item.current_location || '').toUpperCase();
        const carrier = (item.cab ? item.cab.carrier || '' : '').toUpperCase();
        const carrierName = getCarrierName(carrier).toUpperCase();
        const driverName = (item.cab ? 
                          (item.cab.first_name || '') + ' ' + (item.cab.last_name || '').trim() : '').toUpperCase();
        const driverPhone = (item.cab ? item.cab.driver_cell_no || '' : '').toUpperCase();
        const cabNo = (item.cab ? item.cab.cab_no || '' : '').toUpperCase();
        const trailerName = (item.name || '').toUpperCase();
        const arrivalTime = formatTimestamp(item.arrival_time).toUpperCase();
        const timeDifference = calculateDwellTime(item.arrival_time).toUpperCase();
        
        // Appointment data
        const appointmentInfo = appointmentCache[item.trailer?.shipment_no || ''] || { appointmentTime: null, sectionName: '' };
        const appointmentTime = appointmentInfo.appointmentTime ? formatTimestamp(appointmentInfo.appointmentTime).toUpperCase() : '';
        const appointmentDiff = (item.arrival_time && appointmentInfo.appointmentTime) ? 
                               calculateTimeDifference(item.arrival_time, appointmentInfo.appointmentTime).toUpperCase() : '';
        const sectionName = (appointmentInfo.sectionName || '').toUpperCase();
        
        // Notification data
        const notificationTime = extractNotificationTime(item);
        
        // Security incident data
        const securityIncident = extractSecurityIncident(item);
        
        // Warehouse incident data
        const warehouseIncident = extractWarehouseIncident(item);
        
        // Rejection reason data
        const rejectionReason = extractRejectionReason(item);
        
        // Task data
        const ingressTime = getTaskTimeForAsset(item.uuid, 'spot', 'created_time');
        const arrivalToRampTime = getTaskTimeForAsset(item.uuid, 'spot', 'completed_time');
        const endLoadingTime = getTaskTimeForAsset(item.uuid, 'pull', 'created_time');
        const exitRampTime = getTaskTimeForAsset(item.uuid, 'pull', 'completed_time');
        
        // Common cell style with borders
        const cellStyle = `
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          padding: 8px;
          vertical-align: middle;
        `;
        
        // Create cells
        const tdReference1 = document.createElement('td');
        tdReference1.textContent = reference1;
        tdReference1.style.cssText = cellStyle;
        
        const tdReference2 = document.createElement('td');
        tdReference2.textContent = reference2;
        tdReference2.style.cssText = cellStyle;
        
        const tdStatus = document.createElement('td');
        tdStatus.textContent = statusText;
        tdStatus.style.cssText = cellStyle;
        
        const tdCommodity = document.createElement('td');
        tdCommodity.textContent = commodity;
        tdCommodity.style.cssText = cellStyle;
        
        const tdSku = document.createElement('td');
        tdSku.textContent = sku;
        tdSku.style.cssText = cellStyle;
        
        const tdServiceType = document.createElement('td');
        tdServiceType.textContent = serviceTypeText;
        tdServiceType.style.cssText = cellStyle;
        
        const tdLocation = document.createElement('td');
        tdLocation.textContent = location;
        tdLocation.style.cssText = cellStyle;
        
        const tdCarrier = document.createElement('td');
        tdCarrier.textContent = carrier;
        tdCarrier.style.cssText = cellStyle;
        
        const tdCarrierName = document.createElement('td');
        tdCarrierName.textContent = carrierName;
        tdCarrierName.style.cssText = cellStyle;
        
        const tdDriverName = document.createElement('td');
        tdDriverName.textContent = driverName;
        tdDriverName.style.cssText = cellStyle;
        
        const tdDriverPhone = document.createElement('td');
        tdDriverPhone.textContent = driverPhone;
        tdDriverPhone.style.cssText = cellStyle;
        
        const tdCabNo = document.createElement('td');
        tdCabNo.textContent = cabNo;
        tdCabNo.style.cssText = cellStyle;
        
        const tdTrailerName = document.createElement('td');
        tdTrailerName.textContent = trailerName;
        tdTrailerName.style.cssText = cellStyle;
        
        const tdArrivalTime = document.createElement('td');
        tdArrivalTime.textContent = arrivalTime;
        tdArrivalTime.style.cssText = cellStyle;
        
        const tdTimeDifference = document.createElement('td');
        tdTimeDifference.className = 'time-diff';
        tdTimeDifference.innerHTML = timeDifference;
        tdTimeDifference.style.cssText = cellStyle;
        
        // Appointment columns
        const tdAppointmentTime = document.createElement('td');
        tdAppointmentTime.textContent = appointmentTime;
        tdAppointmentTime.style.cssText = cellStyle;
        
        const tdAppointmentDiff = document.createElement('td');
        tdAppointmentDiff.textContent = appointmentDiff;
        tdAppointmentDiff.style.cssText = cellStyle;
        
        const tdSectionName = document.createElement('td');
        tdSectionName.textContent = sectionName;
        tdSectionName.style.cssText = cellStyle;
        
        // Notification column (VIEW ONLY - NO BUTTON)
        const tdNotification = document.createElement('td');
        tdNotification.style.cssText = cellStyle;
        if (notificationTime) {
          tdNotification.textContent = formatTimestamp(notificationTime).toUpperCase();
        } else {
          tdNotification.textContent = 'NO ENVIADO';
        }
        
        // Security incident column (VIEW ONLY)
        const tdSecurityIncident = document.createElement('td');
        tdSecurityIncident.style.cssText = cellStyle;
        tdSecurityIncident.textContent = securityIncident ? securityIncident.toUpperCase() : '';
        
        // Warehouse incident column (EDITABLE)
        const tdWarehouseIncident = document.createElement('td');
        tdWarehouseIncident.style.cssText = cellStyle;
        if (warehouseIncident) {
          tdWarehouseIncident.textContent = warehouseIncident.toUpperCase();
          
          // Add edit button
          const editButton = document.createElement('button');
          editButton.textContent = '✏️';
          editButton.style.cssText = `
            margin-left: 5px;
            padding: 2px 5px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
          `;
          editButton.onclick = function() {
            const newIncident = prompt("Actualizar incidente de almacén:", warehouseIncident);
            if (newIncident !== null) {
              updateWarehouseIncident(item, newIncident)
                .catch(err => {
                  alert('Error actualizando incidente: ' + err.message);
                });
            }
          };
          tdWarehouseIncident.appendChild(editButton);
        } else {
          const addButton = document.createElement('button');
          addButton.textContent = 'AÑADIR';
          addButton.className = 'warehouse-button';
          addButton.style.cssText = `
            padding: 4px 8px;
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          `;
          addButton.onclick = function() {
            const incidentText = prompt("Ingrese el comentario de incidente de almacén:");
            if (incidentText) {
              updateWarehouseIncident(item, incidentText)
                .catch(err => {
                  alert('Error añadiendo incidente: ' + err.message);
                });
            }
          };
          tdWarehouseIncident.appendChild(addButton);
        }
        
        // Rejection column
        const tdRejection = document.createElement('td');
        tdRejection.style.cssText = cellStyle;
        if (rejectionReason) {
          tdRejection.textContent = rejectionReason.toUpperCase();
          
          // Add edit button
          const editButton = document.createElement('button');
          editButton.textContent = '✏️';
          editButton.style.cssText = `
            margin-left: 5px;
            padding: 2px 5px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
          `;
          editButton.onclick = function() {
            showRejectionModal(item);
          };
          tdRejection.appendChild(editButton);
        } else {
          const rejectButton = document.createElement('button');
          rejectButton.textContent = 'RECHAZAR';
          rejectButton.className = 'reject-button';
          rejectButton.style.cssText = `
            padding: 4px 8px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          `;
          rejectButton.onclick = function() {
            showRejectionModal(item);
          };
          tdRejection.appendChild(rejectButton);
        }
        
        // Task data columns
        const tdIngressTime = document.createElement('td');
        tdIngressTime.textContent = ingressTime ? formatTimestamp(ingressTime).toUpperCase() : '';
        tdIngressTime.style.cssText = cellStyle;
        
        const tdArrivalToRampTime = document.createElement('td');
        tdArrivalToRampTime.textContent = arrivalToRampTime ? formatTimestamp(arrivalToRampTime).toUpperCase() : '';
        tdArrivalToRampTime.style.cssText = cellStyle;
        
        const tdEndLoadingTime = document.createElement('td');
        tdEndLoadingTime.textContent = endLoadingTime ? formatTimestamp(endLoadingTime).toUpperCase() : '';
        tdEndLoadingTime.style.cssText = cellStyle;
        
        const tdExitRampTime = document.createElement('td');
        tdExitRampTime.textContent = exitRampTime ? formatTimestamp(exitRampTime).toUpperCase() : '';
        tdExitRampTime.style.cssText = cellStyle;
        
        // Status column
        const tdItemStatus = document.createElement('td');
        tdItemStatus.textContent = itemStatus.toUpperCase();
        tdItemStatus.style.cssText = cellStyle + 'font-weight: bold;';
        
        // Append all cells to the row
        row.appendChild(tdReference1);
        row.appendChild(tdReference2);
        row.appendChild(tdStatus);
        row.appendChild(tdCommodity);
        row.appendChild(tdSku);
        row.appendChild(tdServiceType);
        row.appendChild(tdLocation);
        row.appendChild(tdCarrier);
        row.appendChild(tdCarrierName);
        row.appendChild(tdDriverName);
        row.appendChild(tdDriverPhone);
        row.appendChild(tdCabNo);
        row.appendChild(tdTrailerName);
        row.appendChild(tdArrivalTime);
        row.appendChild(tdTimeDifference);
        row.appendChild(tdAppointmentTime);
        row.appendChild(tdAppointmentDiff);
        row.appendChild(tdSectionName);
        row.appendChild(tdNotification);
        row.appendChild(tdSecurityIncident);
        row.appendChild(tdWarehouseIncident);
        row.appendChild(tdRejection);
        row.appendChild(tdIngressTime);
        row.appendChild(tdArrivalToRampTime);
        row.appendChild(tdEndLoadingTime);
        row.appendChild(tdExitRampTime);
        row.appendChild(tdItemStatus);
        
        tableBody.appendChild(row);
      } catch (err) {
        console.log('Error processing row ' + index + ':', err.message);
      }
    });
    
    // Update filter count display
    const statusMsg = document.getElementById('yard-status-message');
    if (statusMsg) {
      const statusSpan = statusMsg.querySelector('span');
      if (statusSpan) {
        if (displayData.length < yardData.length) {
          statusSpan.textContent = 'MOSTRANDO ' + displayData.length + ' DE ' + yardData.length + ' REGISTROS (FILTRADOS)';
        } else {
          statusSpan.textContent = 'MOSTRANDO ' + yardData.length + ' REGISTROS';
        }
      }
    }
    
    console.log("Table updated successfully");
  }
 
  // Adjust color brightness (for row highlighting)
  function adjustBrightness(color, percent) {
    if (!color || color === 'transparent') return '#f5f5f5';
    
    // Handle hex colors
    if (color.indexOf('#') === 0) {
      let R = parseInt(color.substring(1,3), 16);
      let G = parseInt(color.substring(3,5), 16);
      let B = parseInt(color.substring(5,7), 16);
 
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
 
      R = (R < 255) ? R : 255;  
      G = (G < 255) ? G : 255;  
      B = (B < 255) ? B : 255;  
 
      const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
      const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
      const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
 
      return "#"+RR+GG+BB;
    }
    
    // Handle rgb colors
    if (color.indexOf('rgb') === 0) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        let R = parseInt(rgb[0]);
        let G = parseInt(rgb[1]);
        let B = parseInt(rgb[2]);
        
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
 
        R = (R < 255) ? R : 255;  
        G = (G < 255) ? G : 255;  
        B = (B < 255) ? B : 255;  
        
        return 'rgb(' + R + ',' + G + ',' + B + ')';
      }
    }
    
    return color;
  }
 
  // Update only the time difference cells to avoid full table rerender
  function updateTimeDiffCells() {
    const timeDiffCells = document.querySelectorAll('.time-diff');
    
    // Get filtered and sorted data
    const displayData = getFilteredAndSortedData();
    
    displayData.forEach((item, index) => {
      if (index < timeDiffCells.length && item.arrival_time) {
        timeDiffCells[index].innerHTML = calculateDwellTime(item.arrival_time).toUpperCase();
      }
    });
  }
 
  // Create column header with sort capabilities
  function createSortableHeader(text, columnIndex) {
    const th = document.createElement('th');
    th.style.cssText = `
      position: relative;
      cursor: pointer;
      padding-right: 20px;
      background-color: #4185f4;
      border-left: 1px solid #2a70f0;
      border-right: 1px solid #2a70f0;
      color: white;
    `;
    
    // Header text content
    const headerText = document.createElement('span');
    headerText.textContent = text.toUpperCase();
    th.appendChild(headerText);
    
    // Sort indicator
    const sortIndicator = document.createElement('span');
    sortIndicator.style.cssText = `
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    `;
    
    // Update sort indicator based on current sort config
    if (sortConfig.column === columnIndex) {
      sortIndicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    th.appendChild(sortIndicator);
    
    // Filter input
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'FILTRAR...';
    filterInput.style.cssText = `
      display: block;
      width: calc(100% - 10px);
      margin-top: 4px;
      padding: 4px;
      box-sizing: border-box;
      font-size: 12px;
      color: #333;
      text-transform: uppercase;
    `;
    
    // Set initial filter value
    if (filters[columnIndex]) {
      filterInput.value = filters[columnIndex];
    }
    
    // Add input event listener
    filterInput.addEventListener('input', function() {
      filters[columnIndex] = this.value;
      updateTable();
    });
    
    th.appendChild(filterInput);
    
    // Add click event for sorting
    th.addEventListener('click', function(e) {
      // Don't trigger sort when clicking on the filter input
      if (e.target === filterInput) return;
      
      // Toggle sort direction or set new column
      if (sortConfig.column === columnIndex) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortConfig.column = columnIndex;
        sortConfig.direction = 'asc';
      }
      
      // Update all sort indicators
      document.querySelectorAll('th span:last-child').forEach((indicator, idx) => {
        if (idx !== columnIndex) {
          indicator.textContent = '';
        } else {
          indicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓';
        }
      });
      
      updateTable();
    });
    
    return th;
  }
 
  // Create and show the console modal
  function showConsole() {
    console.log("Showing console modal");
    
    if (modalCreated) {
      document.getElementById('yard-console-modal').style.display = 'block';
      // Ensure status bar stays visible
      showStatusBar();
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'yard-console-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: 10001;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'ESTADO DE PATIO';
    title.style.margin = '0';
    
    const controlsDiv = document.createElement('div');
    
    // Add refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'REFRESCAR';
    refreshBtn.style.cssText = `
      margin-right: 10px;
      padding: 5px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    refreshBtn.onclick = () => {
      console.log("Manual refresh triggered from console");
      fetchYardData(true);
    };
    
    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'EXPORTAR A EXCEL';
    exportBtn.style.cssText = `
      margin-right: 10px;
      padding: 5px 15px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    exportBtn.onclick = () => {
      // Load XLSX library before exporting
      loadXLSXLibrary()
        .then(() => exportToExcel())
        .catch(() => exportToCSV()); // Fallback to CSV export
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #333;
    `;
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      hideStatusBar();
    };
    
    controlsDiv.appendChild(exportBtn);
    controlsDiv.appendChild(refreshBtn);
    controlsDiv.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controlsDiv);
    
    const tableContainer = document.createElement('div');
    tableContainer.style.cssText = `
      overflow-x: auto;
      flex-grow: 1;
    `;
    
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      border: 2px solid #2a70f0;
      text-transform: uppercase;
    `;
    
    const thead = document.createElement('thead');
    thead.style.cssText = `
      background-color: #4185f4;
      color: white;
      position: sticky;
      top: 0;
      text-transform: uppercase;
    `;
    
    // Create header row with sortable and filterable headers (updated to exclude GAFETE and IDENTIFICACIÓN)
    const headerRow = document.createElement('tr');
    
    const headers = [
      'Folio', 'Entrega', 'Estado', 'Material', 'Descripción', 
      'Tipo', 'Ubicación actual', 'Linea', 'Nombre Linea', 'Nombre operador', 
      'Teléfono operador', 'Económico tracto', 'Económico trailer', 
      'Hora reportado', 'Tiempo de estancia', 'Fecha de la cita',
      'Diferencia vs. cita', 'Sección cita', 'Aviso enviado', 'Incidente seguridad',
      'Incidente almacén', 'Rechazo', 'Hora de ingreso', 'Hora de llegada a rampa',
      'Hora de fin de carga/descarga', 'Hora de salida de rampa', 'Status'
    ];
    
    headers.forEach((headerText, index) => {
      const th = createSortableHeader(headerText, index);
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    tbody.id = 'yard-table-body';
    tbody.style.cssText = `
      tr:hover {
        opacity: 0.8 !important;
      }
      td {
        padding: 8px;
        border: 1px solid #ddd;
        text-transform: uppercase;
      }
    `;
    
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    modal.appendChild(header);
    modal.appendChild(tableContainer);
    document.body.appendChild(modal);
    
    modalCreated = true;
    console.log("Modal created");
    
    // Add status message element
    const statusMsg = document.createElement('div');
    statusMsg.id = 'yard-status-message';
    statusMsg.style.cssText = `
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: uppercase;
    `;
    
    // Create status message without template literals
    const statusSpan = document.createElement('span');
    statusSpan.textContent = 'CARGANDO DATOS DEL PATIO...';
    
    const statusInfo = document.createElement('div');
    statusInfo.innerHTML = 
      '<strong>AUTH:</strong> ' + (authorization ? '✅' : '❌') + 
      ' <strong>COOKIE:</strong> ' + (cookieValue ? '✅' : '❌');
    
    statusMsg.appendChild(statusSpan);
    statusMsg.appendChild(statusInfo);
    
    modal.insertBefore(statusMsg, tableContainer);
    
    fetchYardData();
    
    // Start refreshing time difference every second
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }
    refreshIntervalId = setInterval(updateTimeDiffCells, 1000);
    
    // Display sample data if no real data available after 3 seconds
    setTimeout(() => {
      if (yardData.length === 0) {
        console.log("No data after timeout, using fallback sample data");
        yardData = createSampleData();
        updateTable();
      }
    }, 3000);
  }
 
  // Create sample data for testing
  function createSampleData() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const twoHoursAgo = now - 7200000;
    const fiveHoursAgo = now - 18000000;
 
    // Sample appointment times
    const sampleAppointment1 = now + 1800000; // 30 minutes in future
    const sampleAppointment2 = oneHourAgo - 1800000; // 30 minutes before oneHourAgo
    
    const samples = [
      {
        trailer: {
          shipment_details: {
            reference_1: "10789315",
            reference_2: "ib-0226605606",
            sku: ["000000000002010099-env mod especial 12 oz granel premium"]
          },
          service_type: "inbound",
          shipment_no: "10789315_1",
          comment: "<a><b>angel</b><c>espinoza</c><d></d><e></e><f></f><g></g><h></h><i>380</i><j></j><k>2017</k><l>kenworth</l><m>20942063</m><n>y2a0ct</n><o>2012</o><p>hytr</p><u>mxtraabe</u><s1>1736790117367902</s1><critico></critico></a>\n<q></q>\n<r></r>\n<s></s>\n<t></t>\n<s2></s2><sc>1752651400000</sc><x>Incidente con llanta trasera</x><y>Problema con el almacén 5</y><rr>R1-RECHAZO LLANTA POCHADA</rr>"
        },
        status: "empty",
        commodity: "envaselv03",
        current_location: "llegada1",
        cab: {
          carrier: "mxtraabe",
          first_name: "angel",
          last_name: "espinoza",
          driver_cell_no: "6221478130",
          cab_no: "380"
        },
        name: "20942063",
        arrival_time: now - 1800000, // 30 minutes ago
        uuid: "sample-uuid-1"
      },
      {
        trailer: {
          shipment_details: {
            reference_1: "10767178",
            reference_2: "ib-0226430389"
          },
          service_type: "inbound",
          shipment_no: "10767178_1",
          comment: "<y>Documentos faltantes</y>"
        },
        status: "loaded",
        commodity: "envaselv03im",
        current_location: "stg-09",
        cab: {
          carrier: "xpog",
          first_name: "natividad",
          last_name: "bojorquez",
          driver_cell_no: "6681701792",
          cab_no: "23"
        },
        name: "411422",
        arrival_time: oneHourAgo,
        uuid: "sample-uuid-2"
      },
      {
        trailer: {
          shipment_details: {
            reference_1: "10767172",
            reference_2: "ib-0226430364",
            sku: ["000000000002010099-btl mod esp 12oz bulk premium"]
          },
          service_type: "inbound",
          shipment_no: "10767172_2",
          comment: "<rr>R2-RECHAZO ALMACEN LLENO</rr>"
        },
        status: "loaded",
        commodity: "envaselv03im",
        current_location: "stg-22",
        cab: {
          carrier: "xpog",
          first_name: "raul",
          last_name: "tejada",
          driver_cell_no: "6441500367",
          cab_no: "t04"
        },
        name: "412616",
        arrival_time: twoHoursAgo,
        uuid: "sample-uuid-3"
      },
      {
        trailer: {
          service_type: "outbound",
          shipment_no: "10767171_1"
        },
        status: "empty",
        current_location: "cpt2-08",
        cab: {
          carrier: "LEYVA",
          cab_no: "ley07"
        },
        name: "07",
        arrival_time: fiveHoursAgo,
        uuid: "sample-uuid-4"
      }
    ];
    
    // Add sample appointment data to cache
    appointmentCache["10789315_1"] = {
      appointmentTime: sampleAppointment1,
      sectionName: "pt 1"
    };
    
    appointmentCache["10767178_1"] = {
      appointmentTime: sampleAppointment2,
      sectionName: "pt 2"
    };
    
    // Add sample task data
    taskData = [
      {
        task_type: {
          code: "spot",
        },
        created_time: now - 2000000,
        completed_time: now - 1800000,
        assets: [{ uuid: "sample-uuid-1" }]
      },
      {
        task_type: {
          code: "pull",
        },
        created_time: now - 1000000,
        completed_time: now - 800000,
        assets: [{ uuid: "sample-uuid-1" }]
      },
      {
        task_type: {
          code: "spot",
        },
        created_time: now - 4000000,
        completed_time: now - 3800000,
        assets: [{ uuid: "sample-uuid-2" }]
      },
      {
        task_type: {
          code: "pull",
        },
        created_time: now - 3000000,
        completed_time: now - 2800000,
        assets: [{ uuid: "sample-uuid-2" }]
      }
    ];
    
    // Add sample carrier data
    carrierData = [
      { scac: "mxtraabe", name: "Transportes Abel" },
      { scac: "xpog", name: "XPO Logistics" },
      { scac: "LEYVA", name: "Leyva Transport" },
      { scac: "abt", name: "abt" },
      { scac: "0abt", name: "ABT Express Services" }
    ];
    
    return samples;
  }
 
  // Intercept XHR requests to capture authorization and cookies
  function interceptXHR() {
    console.log("Setting up XHR interception");
    
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener('load', function() {
        if (this.responseURL && this.responseURL.includes('yard-visibility-na12.api.project44.com')) {
          console.log('XHR intercepted: ' + this.responseURL);
          
          // Get the request headers from the original request
          try {
            const authHeader = this._requestHeaders?.find(h => h.name === 'Authorization')?.value;
            const cookieHeader = this._requestHeaders?.find(h => h.name === 'Cookie')?.value;
            
            if (authHeader) {
              authorization = authHeader;
              console.log("Authorization captured from XHR");
            }
            
            if (cookieHeader) {
              cookieValue = cookieHeader;
              console.log("Cookie captured from XHR");
            }
            
            if (authorization && cookieValue && !yardData.length) {
              fetchYardData();
            }
          } catch (e) {
            console.log("Error extracting headers:", e.message);
          }
        }
      });
      origOpen.apply(this, arguments);
    };
    
    // Store original setRequestHeader
    const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      // Store headers for later use
      if (!this._requestHeaders) this._requestHeaders = [];
      this._requestHeaders.push({ name: header, value: value });
      
      if (header.toLowerCase() === 'authorization' && value) {
        authorization = value;
        console.log("Authorization captured from setRequestHeader");
      }
      
      if (header.toLowerCase() === 'cookie' && value) {
        cookieValue = value;
        console.log("Cookie captured from setRequestHeader");
      }
      
      return origSetRequestHeader.apply(this, arguments);
    };
  }
 
  // Also intercept fetch requests
  function interceptFetch() {
    console.log("Setting up fetch interception");
    
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      if (url && url.toString().includes('yard-visibility-na12.api.project44.com')) {
        console.log('Fetch intercepted: ' + url.toString());
        
        if (options.headers) {
          const headers = options.headers instanceof Headers ? 
            Object.fromEntries([...options.headers.entries()]) : 
            options.headers;
            
          if (headers.Authorization || headers.authorization) {
            authorization = headers.Authorization || headers.authorization;
            console.log("Authorization captured from fetch");
          }
          
          if (headers.Cookie || headers.cookie) {
            cookieValue = headers.Cookie || headers.cookie;
            console.log("Cookie captured from fetch");
          }
        }
      }
      return originalFetch.apply(this, arguments);
    };
  }
 
  // Extract cookies from document
  function extractCookies() {
    console.log("Attempting to extract cookies from document");
    if (document.cookie) {
      cookieValue = document.cookie;
      console.log("Cookies extracted from document");
    } else {
      console.log("No cookies found in document");
    }
  }
 
  // Get token from local storage
  function getTokenFromStorage() {
    console.log("Attempting to get token from storage");
    try {
      // Check for common token storage patterns
      const storageKeys = ['token', 'accessToken', 'jwt', 'authToken', 'p44_token', 'yard_token'];
      
      for (let key of storageKeys) {
        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) {
          authorization = 'Bearer ' + token;
          console.log('Token found in storage: ' + key);
          return true;
        }
      }
      
      // Try to find token in any storage key
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        if (typeof value === 'string' && (
            value.startsWith('eyJ') || 
            value.includes('token') || 
            key.includes('token') || 
            key.includes('auth')
        )) {
          console.log('Potential token found in localStorage: ' + key);
          if (value.startsWith('Bearer ')) {
            authorization = value;
          } else if (value.startsWith('eyJ')) {
            authorization = 'Bearer ' + value;
          }
          return true;
        }
      }
      
      console.log("No token found in storage");
      return false;
    } catch (e) {
      console.log("Error accessing storage:", e.message);
      return false;
    }
  }
 
  // Initialize the script
  function init() {
    console.log("Initializing Yard Console");
    createButton();
    createStatusBar();
    interceptXHR();
    interceptFetch();
    extractCookies();
    getTokenFromStorage();
    
    // Check for new trailer records every 10 seconds
    trailerCheckIntervalId = setInterval(() => {
      if (authorization && cookieValue) {
        fetchYardData();
      }
    }, 10000);
    
    // Refresh task data every 30 seconds
    taskRefreshIntervalId = setInterval(() => {
      if (authorization && cookieValue) {
        fetchTaskData().catch(err => {
          console.log("Error refreshing task data:", err.message);
        });
      }
    }, 30000);
    
    console.log("Initialization complete");
  }
 
  // Run the init function
  init();
})();