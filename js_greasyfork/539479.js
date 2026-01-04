Tabs.Defend = {
  tabOrder: 1000,
  tabLabel: 'Defend',
  tabDisabled: false,
  myDiv: null,
  timer: null,
  defendingCities: [],
  mapScanInProgress: false,
  mapScanX: 0,
  mapScanY: 0,
  mapScanRadius: 10,
  mapScanDelay: 500, // ms between map tile checks
  
  init: function(div) {
    var t = Tabs.Defend;
    t.myDiv = div;
    
    div.innerHTML = '<DIV class=divHeader align=center>' + tx('Defending Cities Scanner') + '</DIV>' +
      '<DIV id=btDefendMain class=btPopMain style="height:100%">' +
      '<CENTER><BR><DIV id=btDefendStatus style="min-width:400px;height:20px;font-weight:bold;"></DIV></CENTER>' +
      '<DIV id=btDefendOptions>' +
      '<TABLE width=100% class=xtab><TR>' +
      '<TD><B>Scan Center:</B> X: <INPUT id=btDefendScanX type=text size=3 maxlength=3 value="' + uW.currentcityid.x + '" /> ' +
      'Y: <INPUT id=btDefendScanY type=text size=3 maxlength=3 value="' + uW.currentcityid.y + '" /></TD>' +
      '<TD>Radius: <INPUT id=btDefendScanRadius type=text size=2 maxlength=2 value="10" /></TD>' +
      '<TD align=right><INPUT id=btDefendScanMap type=button value="Scan Map" /></TD>' +
      '</TR></TABLE>' +
      '<HR>' +
      '<TABLE width=100% class=xtab><TR>' +
      '<TD><INPUT id=btDefendShowOwn type=checkbox checked /> Show my cities</TD>' +
      '<TD><INPUT id=btDefendShowAlliance type=checkbox checked /> Show alliance cities</TD>' +
      '<TD><INPUT id=btDefendShowOthers type=checkbox checked /> Show enemy cities</TD>' +
      '</TR></TABLE>' +
      '</DIV>' +
      '<DIV id=btDefendProgress style="width:100%;height:20px;margin-top:5px;display:none;">' +
      '<DIV style="width:100%;height:10px;background-color:#ddd;border:1px solid #888;">' +
      '<DIV id=btDefendProgressBar style="width:0%;height:10px;background-color:#00a;"></DIV>' +
      '</DIV>' +
      '<DIV id=btDefendProgressText style="text-align:center;font-size:10px;margin-top:2px;"></DIV>' +
      '</DIV>' +
      '<DIV id=btDefendCityList style="max-height:400px; overflow-y:auto;margin-top:10px;"></DIV>' +
      '</DIV>';
    
    // Event listeners
    ById('btDefendScanMap').addEventListener('click', t.startMapScan, false);
    ById('btDefendShowOwn').addEventListener('change', t.filterResults, false);
    ById('btDefendShowAlliance').addEventListener('change', t.filterResults, false);
    ById('btDefendShowOthers').addEventListener('change', t.filterResults, false);
    
    // Initial message
    ById('btDefendStatus').innerHTML = 'Ready to scan for defending cities on the map';
  },
  
  show: function() {
    var t = Tabs.Defend;
    // Update center coordinates to current city when tab is shown
    if (uW.currentcityid) {
      ById('btDefendScanX').value = uW.currentcityid.x;
      ById('btDefendScanY').value = uW.currentcityid.y;
    }
  },
  
  hide: function() {
    var t = Tabs.Defend;
    // Stop any ongoing scan when tab is hidden
    t.stopMapScan();
  },
  
  startMapScan: function() {
    var t = Tabs.Defend;
    
    if (t.mapScanInProgress) {
      t.stopMapScan();
      return;
    }
    
    // Get scan parameters
    t.mapScanX = parseInt(ById('btDefendScanX').value);
    t.mapScanY = parseInt(ById('btDefendScanY').value);
    t.mapScanRadius = parseInt(ById('btDefendScanRadius').value);
    
    // Validate inputs
    if (isNaN(t.mapScanX) || isNaN(t.mapScanY) || isNaN(t.mapScanRadius)) {
      ById('btDefendStatus').innerHTML = '<SPAN style="color:#800;">Invalid coordinates or radius!</SPAN>';
      return;
    }
    
    if (t.mapScanRadius < 1) t.mapScanRadius = 1;
    if (t.mapScanRadius > 35) t.mapScanRadius = 35; // Limit to reasonable size
    
    // Reset results
    t.defendingCities = [];
    t.mapScanInProgress = true;
    ById('btDefendScanMap').value = "Stop Scan";
    
    // Show progress bar
    ById('btDefendProgress').style.display = '';
    ById('btDefendProgressBar').style.width = '0%';
    ById('btDefendProgressText').innerHTML = 'Preparing scan...';
    ById('btDefendStatus').innerHTML = 'Scanning map for defending cities...';
    
    // Create list of coordinates to scan
    t.scanCoords = [];
    for (var x = t.mapScanX - t.mapScanRadius; x <= t.mapScanX + t.mapScanRadius; x++) {
      for (var y = t.mapScanY - t.mapScanRadius; y <= t.mapScanY + t.mapScanRadius; y++) {
        // Check if coordinates are within map bounds
        if (x >= 0 && x <= 749 && y >= 0 && y <= 749) {
          // Calculate distance from center
          var dist = Math.sqrt(Math.pow(x - t.mapScanX, 2) + Math.pow(y - t.mapScanY, 2));
          if (dist <= t.mapScanRadius) {
            t.scanCoords.push({x: x, y: y});
          }
        }
      }
    }
    
    t.totalTiles = t.scanCoords.length;
    t.tilesScanned = 0;
    
    // Start scanning
    t.scanNextTile();
  },
  
  scanNextTile: function() {
    var t = Tabs.Defend;
    
    if (!t.mapScanInProgress || t.scanCoords.length === 0) {
      t.finishMapScan();
      return;
    }
    
    // Get next coordinate to scan
    var coord = t.scanCoords.shift();
    t.tilesScanned++;
    
    // Update progress
    var progress = Math.floor((t.tilesScanned / t.totalTiles) * 100);
    ById('btDefendProgressBar').style.width = progress + '%';
    ById('btDefendProgressText').innerHTML = 'Scanning: ' + t.tilesScanned + ' / ' + t.totalTiles + ' tiles';
    
    // Check map data for this tile
    uW.cm.MapController.fetchTileData(coord.x, coord.y, function(result) {
      if (result && result.tileInfo) {
        var tile = result.tileInfo;
        
        // Check if it's a city and if it's defending
        if (tile.tileType == 51 && tile.cityInfo) { // 51 is city tile type
          var cityInfo = tile.cityInfo;
          
          // Check if city is defending (look for defense status or defense boost)
          var isDefending = false;
          
          // Method 1: Check defense status directly if available
          if (cityInfo.defStatus && cityInfo.defStatus == 1) {
            isDefending = true;
          }
          
          // Method 2: Check for defense boost effects
          if (cityInfo.effects) {
            for (var i = 0; i < cityInfo.effects.length; i++) {
              var effect = cityInfo.effects[i];
              // Defense boost effects typically have IDs in certain ranges
              // This is an approximation - actual IDs may vary
              if (DefenceEffects.indexOf(effect.effectId) >= 0) {
                isDefending = true;
                break;
              }
            }
          }
          
          if (isDefending) {
            // Determine ownership type
            var ownerType = "enemy";
            if (cityInfo.playerId == uW.tvuid) {
              ownerType = "own";
            } else if (cityInfo.allianceId && cityInfo.allianceId == uW.seed.allianceInfo.allianceId) {
              ownerType = "alliance";
            }
            
            t.defendingCities.push({
              x: coord.x,
              y: coord.y,
              name: cityInfo.cityName || "Unknown City",
              ownerName: cityInfo.playerName || "Unknown Player",
              ownerType: ownerType,
              might: cityInfo.totalMight || 0
            });
          }
        }
      }
      
      // Schedule next tile scan with delay to prevent server overload
      setTimeout(t.scanNextTile, t.mapScanDelay);
    });
  },
  
  stopMapScan: function() {
    var t = Tabs.Defend;
    t.mapScanInProgress = false;
    ById('btDefendScanMap').value = "Scan Map";
    ById('btDefendStatus').innerHTML = 'Scan stopped. Found ' + t.defendingCities.length + ' defending cities.';
  },
  
  finishMapScan: function() {
    var t = Tabs.Defend;
    t.mapScanInProgress = false;
    ById('btDefendScanMap').value = "Scan Map";
    ById('btDefendStatus').innerHTML = 'Scan complete! Found ' + t.defendingCities.length + ' defending cities.';
    ById('btDefendProgress').style.display = 'none';
    
    // Display results
    t.displayResults();
  },
  
  filterResults: function() {
    var t = Tabs.Defend;
    t.displayResults();
  },
  
  displayResults: function() {
    var t = Tabs.Defend;
    
    // Get filter settings
    var showOwn = ById('btDefendShowOwn').checked;
    var showAlliance = ById('btDefendShowAlliance').checked;
    var showOthers = ById('btDefendShowOthers').checked;
    
    // Filter cities based on settings
    var filteredCities = t.defendingCities.filter(function(city) {
      if (city.ownerType === "own" && !showOwn) return false;
      if (city.ownerType === "alliance" && !showAlliance) return false;
      if (city.ownerType === "enemy" && !showOthers) return false;
      return true;
    });
    
    var m = '<TABLE width=100% class=xtab><TR class="xtabHD">' +
            '<TD width=15%>Coordinates</TD>' +
            '<TD width=25%>City Name</TD>' +
            '<TD width=25%>Owner</TD>' +
            '<TD width=15%>Might</TD>' +
            '<TD width=20%>Actions</TD></TR>';
    
    if (filteredCities.length === 0) {
      m += '<TR><TD colspan=5 align=center><BR><SPAN style="color:#800;">No defending cities found matching your filters.</SPAN></TD></TR>';
    } else {
      // Sort cities by distance from scan center
      filteredCities.sort(function(a, b) {
        var distA = Math.sqrt(Math.pow(a.x - t.mapScanX, 2) + Math.pow(a.y - t.mapScanY, 2));
        var distB = Math.sqrt(Math.pow(b.x - t.mapScanX, 2) + Math.pow(b.y - t.mapScanY, 2));
        return distA - distB;
      });
      
      for (var i = 0; i < filteredCities.length; i++) {
        var city = filteredCities[i];
        var rowClass = i % 2 ? 'evenRow' : 'oddRow';
        var ownerColor = '#000';
        
        // Color-code by owner type
        if (city.ownerType === "own") {
          ownerColor = '#080'; // Green for own cities
        } else if (city.ownerType === "alliance") {
          ownerColor = '#008'; // Blue for alliance cities
        } else {
          ownerColor = '#800'; // Red for enemy cities
        }
        
        m += '<TR class="' + rowClass + '">' +
             '<TD>(' + city.x + ',' + city.y + ')</TD>' +
             '<TD>' + city.name + '</TD>' +
             '<TD style="color:' + ownerColor + ';">' + city.ownerName + '</TD>' +
             '<TD>' + addCommas(city.might) + '</TD>' +
             '<TD>' +
             '<INPUT type=button value="View" class="btDefendViewMap" x="' + city.x + '" y="' + city.y + '" /> &nbsp;';
             
        // Add attack button for enemy cities
        if (city.ownerType === "enemy") {
          m += '<INPUT type=button value="Attack" class="btDefendAttack" x="' + city.x + '" y="' + city.y + '" />';
        }
        
        m += '</TD></TR>';
      }
    }
    
    m += '</TABLE>';
    ById('btDefendCityList').innerHTML = m;
    
    // Add event listeners to buttons
    var mapButtons = document.getElementsByClassName('btDefendViewMap');
    for (var i = 0; i < mapButtons.length; i++) {
      mapButtons[i].addEventListener('click', function() {
        var x = parseInt(this.getAttribute('x'));
        var y = parseInt(this.getAttribute('y'));
        uW.cm.MapController.centerMapOnCoord(x, y);
      }, false);
    }
    
    var attackButtons = document.getElementsByClassName('btDefendAttack');
    for (var i = 0; i < attackButtons.length; i++) {
      attackButtons[i].addEventListener('click', function() {
        var x = parseInt(this.getAttribute('x'));
        var y = parseInt(this.getAttribute('y'));
        t.prepareAttack(x, y);
      }, false);
    }
  },
  
  prepareAttack: function(x, y) {
    var t = Tabs.Defend;
    
    // Center map on target
    uW.cm.MapController.centerMapOnCoord(x, y);
    
    // Open attack dialog
    setTimeout(function() {
      // Find the city tile and click it
      var cityDiv = document.querySelector('div[data-tileclass="city"][data-x="' + x + '"][data-y="' + y + '"]');
      if (cityDiv) {
        nHtml.Click(cityDiv);
        
        // Wait for city info popup to appear
        setTimeout(function() {
          // Find and click the attack button
          var attackBtn = document.querySelector('.cityInfoAttackButton');
          if (attackBtn) {
            nHtml.Click(attackBtn);
          } else {
            actionLog('Could not find attack button for city at ' + x + ',' + y, 'DEFEND');
          }
        }, 1000);
      } else {
        actionLog('Could not find city at ' + x + ',' + y + ' on the map', 'DEFEND');
      }
    }, 1000);
  },
  
  // Helper function to detect if a city is defending
  isCityDefending: function(cityInfo) {
    // This is a more comprehensive check for defending status
    
    // Check direct defense status if available
    if (cityInfo.defStatus && cityInfo.defStatus == 1) {
      return true;
    }
    
    // Check for defense-related effects
    if (cityInfo.effects) {
      for (var i = 0; i < cityInfo.effects.length; i++) {
        var effectId = cityInfo.effects[i].effectId;
        
        // Check against known defense effect IDs
        if (DefenceEffects.indexOf(effectId) >= 0) {
          return true;
        }
        
        // Additional checks for specific defense effects
        // These IDs may need to be adjusted based on the game's current effect system
        if ([2, 18, 25, 30, 35, 40, 45, 51].indexOf(effectId) >= 0) {
          return true;
        }
      }
    }
    
    // Check for defense boost items
    if (cityInfo.activeItems) {
      for (var i = 0; i < cityInfo.activeItems.length; i++) {
        var item = cityInfo.activeItems[i];
        // Shield items typically have IDs like 362, 363, etc.
        if ([362, 363, 364, 365, 366].indexOf(item.itemId) >= 0) {
          return true;
        }
      }
    }
    
    return false;
  }
};

 