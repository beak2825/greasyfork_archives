// ==UserScript==
// @name         PlayCanvas Github Integration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Import files from Github repository to PlayCanvas Editor
// @author       BrandLab360
// @match        https://playcanvas.com/editor/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469450/PlayCanvas%20Github%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/469450/PlayCanvas%20Github%20Integration.meta.js
// ==/UserScript==

(function () {
  'use strict';

    function initPanel() {
    // Ensure pcui and the PlayCanvas Editor API are available
    if (typeof pcui === 'undefined' || typeof editor === 'undefined') {
      console.error('PlayCanvas Editor API or pcui is not available');
      return;
    }

    // Create the UI panel
    const panel = new pcui.Panel({
      headerText: 'Github Integration',
      collapsible: true,
      collapsed: true
    });
    panel.style.position = 'absolute';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.width = '300px';
    editor.call('layout.viewport').append(panel);

    // Create the input field for the GitHub personal access token
    const tokenField = new pcui.TextInput({
      placeholder: 'Enter GitHub Access Token',
      width: '95%'
    });
    panel.append(tokenField);

    // Create the dropdown input
    const dropdown = new pcui.SelectInput({
      options: [
        { v: 'https://github.com/lukesmith1024/PlaycanvasTest', t: 'PlaycanvasTest' }
      ]
    });

    // Add the dropdown input to the panel
    panel.append(dropdown);

    // Create the input field for the GitHub repository URL
    const repoField = new pcui.TextInput({
      placeholder: 'GitHub Repository URL',
    });
    panel.append(repoField);

    // Add an event listener for when the dropdown value changes
    dropdown.on('change', value => {
      repoField.value = value;
    });

    // Create the button for importing files
    const importButton = new pcui.Button({
      text: 'Import from Github',
    });
    panel.append(importButton);

    // Function to recursively import folders and files from the GitHub repository
    async function importFromGithub(token, repoUrl) {
      const apiUrl = 'https://api.github.com';

      // Extract the owner and repository name from the URL
      const [, , , owner, repo] = repoUrl.split('/');

          // Check if a folder with the name of the GitHub repository already exists
      const existingFolder = editor.call('assets:findOne', (asset) => {
        return asset.get('name') === repo && asset.get('type') === 'folder';
      });

      if (existingFolder) {
        var errorMsg = `A folder with the name '${repo}' already exists. Import aborted.`;
        console.error(errorMsg);
        alert(errorMsg);
        return; // Stop importing if the folder already exists
      }

      // Create a root folder with the name of the GitHub repository
      const rootFolderAsset = await new Promise((resolve) => {
        editor.on('assets:add', (asset) => {
          if (asset.get('name') === repo && asset.get('type') === 'folder') {
            resolve(asset);
          }
        });

        editor.call('assets:create', { name: repo, type: 'folder' }, (err) => {
          if (err) {
            console.error(`Error creating root folder asset: ${err}`);
          }
        });
      });

      const rootFolderId = rootFolderAsset.get('id');
      console.log(`Created root folder '${repo}' with ID '${rootFolderId}'`);


      async function getContents(path = '') {
         console.log(`getContents called for path: '${path}'`);
        const response = await fetch(`${apiUrl}/repos/${owner}/${repo}/contents/${path}`, {
          headers: { Authorization: `token ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error fetching contents from repository: ${response.statusText}`);
        }

        const contents = await response.json();
        console.log(`Fetched contents of '${path}':`, contents);
        return contents;
      }


      function isPlayCanvasMaterial(obj) {
        if (typeof obj !== 'object' || obj === null) {
          return false;
        }

        // Check if the object has specific properties that are unique to PlayCanvas materials
        const materialProperties = [
          'ambient',
          'diffuse',
          'specular',
          'shininess',
          'opacity',
        ];

        return materialProperties.every((property) => obj.hasOwnProperty(property));
      }


      function applyMaterialProperties(material, materialData) {
        for (const key in materialData) {
          if (materialData.hasOwnProperty(key) && material.hasOwnProperty(key)) {
            material[key] = materialData[key];
          }
        }
        material.update();
      }

      async function uploadFile(file) {
        console.log(`Uploading file '${file.name}' with type '${file.type}'`);

        console.log('File object:', file);
        console.log('Download URL:', file.download_url);

        const downloadUrl = file.download_url;

        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: downloadUrl,
            responseType: 'arraybuffer',
            headers: {
              'Authorization': `token ${token}`
            },
            onload: async (response) => {
              if (response.status !== 200) {
                reject(new Error(`Error fetching file content: ${response.statusText}`));
                return;
              }

              let fileContent;
               if (file.type === 'application/json') {
                const decoder = new TextDecoder('utf-8');
                const arrayBuffer = new Uint8Array(response.response).buffer;
                const responseText = decoder.decode(arrayBuffer);

                let parsedJson;
                try {
                  parsedJson = JSON.parse(responseText);
                } catch (error) {
                  console.error(`Error parsing JSON for '${file.name}', importing as plain text:`, error);
                  fileContent = new Blob([responseText], { type: 'text/plain' });
                }

               console.log("Parsed JSON:", parsedJson);

               if (isPlayCanvasMaterial(parsedJson)) {
                  file.isMaterial = true;
                  file.materialData = parsedJson;
                  console.log(file.name + " is a material");
                  fileContent = new Blob([responseText], { type: 'text/plain' });
                } else {
                  fileContent = new Blob([JSON.stringify(parsedJson)], { type: 'application/json' });
                }


              } else if (file.isMaterial) {
                const decoder = new TextDecoder('utf-8');
                const arrayBuffer = new Uint8Array(response.response).buffer;
                const responseText = decoder.decode(arrayBuffer);
                fileContent = new Blob([responseText], { type: 'text/plain' });
              } else {
                fileContent = new Blob([response.response], { type: file.type });
              }


              console.log(`File content for '${file.name}':`, fileContent);

              // Create a File instance
              const fileInstance = new File([fileContent], file.name, { type: file.type });

              // Call the createAssetInPlayCanvas function
              const parentFolder = file.parent ? editor.call('assets:get', file.parent) : editor.call('assets:panel:getHierarchy');
              const fileType = getFileTypeFromExtension(file.name);
              await createAssetInPlayCanvas(file.name, fileInstance, file.type, fileType, parentFolder, file.isMaterial, file.materialData);


              resolve();
            },

            onerror: (error) => {
              reject(new Error(`Error fetching file content: ${error}`));
            }
          });
        });
      }

      async function createAssetInPlayCanvas(fileName, file, mimeType, assetType, parentFolder, isMaterial, materialData) {
        let asset;

        isMaterial = isMaterial || false;
        console.log("Is material:", isMaterial);

        if (isMaterial === true) {
          assetType = 'material';
          const materialName = fileName.replace('.json', '');

          console.log("Material name:", materialName);
          console.log("Parent folder ID:", parentFolder.get('id'));
          console.log("Material data:", materialData);

          // Create material asset
          asset = await new Promise((resolve, reject) => {
            const assetAddedHandler = function (addedAsset) {
              if (addedAsset.get('type') === 'material') {
                console.log('Material asset created:', addedAsset);
                editor.off('assets:add', assetAddedHandler);
                resolve(addedAsset);
              }
            };

            editor.on('assets:add', assetAddedHandler);

            console.log("Creating material asset with data:", { name: materialName, type: assetType, parent: parentFolder.get('id'), data: materialData });

            editor.call('assets:create', {
              name: materialName,
              type: assetType,
              parent: parentFolder.get('id'),
              data: materialData,
            }, (materialAsset) => {
              if (!materialAsset) {
                editor.off('assets:add', assetAddedHandler);
                reject('Failed to create the material asset.');
              }
            });
          });

          if (asset) {
            console.log("Material asset created:", asset);

            // Save changes to the material asset
            asset.save();
            console.log("Created material asset:", asset);
          } else {
            console.error('Failed to create the material asset.');
          }

        } else {
          const assetData = {
            name: fileName,
            type: assetType,
            file: file,
            parent: parentFolder.get('id')
          };

          console.log('Asset data:', assetData);

          // Create the asset using 'assets:create' event
          asset = await new Promise((resolve, reject) => {
            editor.call('assets:create', assetData, (err, createdAsset) => {
              if (err) {
                console.error(`Error creating asset: ${err}`);
                reject(err);
              } else {
                resolve(createdAsset);
              }
            });
          });

          console.log('Asset:', asset);

          // Add the asset to the assets registry and the asset panel
          if (asset) {
            console.log('Uploading file for asset:', asset);
            editor.call('assets:panel:files:upload', asset, file);
          } else {
            console.error('Failed to create the asset.');
          }
        }
      }

      function getMimeTypeFromExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'json': 'application/json',
          'txt': 'text/plain',
          'csv': 'text/csv',
          'html': 'text/html',
          'css': 'text/css',
          'js': 'application/javascript',
          'fbx': 'model/vnd.fbx',
          'obj': 'model/obj',
          'mp3': 'audio/mpeg',
          'wav': 'audio/wav',
          'ogg': 'audio/ogg',
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'hdr': 'image/vnd.radiance',
        };

        return mimeTypes[ext] || 'application/octet-stream';
      }

      function getFileTypeFromExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const fileTypes = {
          'png': 'texture',
          'jpg': 'texture',
          'jpeg': 'texture',
          'gif': 'texture',
          'json': 'json',
          'txt': 'text',
          'csv': 'text',
          'html': 'text',
          'css': 'text',
          'js': 'script',
          'fbx': 'model',
          'obj': 'model',
          'mp3': 'audio',
          'wav': 'audio',
          'ogg': 'audio',
          'mp4': 'video',
          'webm': 'video',
          'hdr': 'texture',
        };

        return fileTypes[ext] || 'unknown';
      }

      async function processFolder(contents, parentFolderId = null) {
        console.log(`Contents of '${parentFolderId || ''}':`, contents);

        // Wait for all folder creations and file uploads to complete
        await Promise.all(contents.map(async (item) => {
          if (item.type === 'dir') {
            console.log(`Processing folder: '${item.name}'`);
            const folderData = {
              name: item.name,
              type: 'folder',
              parent: parentFolderId
            };

            const folderAsset = await new Promise((resolve) => {
              editor.on('assets:add', (asset) => {
                if (asset.get('name') === folderData.name && asset.get('type') === folderData.type) {
                  resolve(asset);
                }
              });

              editor.call('assets:create', folderData, (err) => {
                if (err) {
                  console.error(`Error creating folder asset: ${err}`);
                }
              });
            });

            const folderId = folderAsset.get('id');
            console.log(`Created folder '${item.name}' with ID '${folderId}'`);

            const subContents = await getContents(item.path);
            await processFolder(subContents, folderId);
          } else {
            console.log(`Processing file: '${item.name}'`);
            const file = {
              name: item.name,
              path: item.path,
              type: getMimeTypeFromExtension(item.path),
              download_url: item.download_url,
              parent: parentFolderId,
            };
            await uploadFile(file);
          }
        }));
      }

      try {
        const rootContents = await getContents();
        await processFolder(rootContents, rootFolderId, token);

      } catch (err) {
        console.error(`Error importing from Github: ${err.message}`);
      }
    }

     // Handle the click event on the import button
    importButton.on('click', () => {
      const token = tokenField.value;
      const repoUrl = repoField.value;

        if (!token || !repoUrl) {
          console.error('Please provide a GitHub personal access token and a repository URL');
          return;
        }

      importFromGithub(token, repoUrl);
    });
  }

  // Initialize the panel after a delay to make sure the editor is fully loaded
  setTimeout(() => {
  initPanel();
  }, 5000);

    // Load scripts in Editor folder as extentions
  const importExtensionsFromAssets = () => {
    const extentionsFolder = editor.assets.list().find((data) => {
      const { type, name, path } = data.json();
      return type === "folder" && name === "Editor";
    });

    if (!extentionsFolder) {
      console.warn("Create an Editor folder in the assets.");
      return;
    }

    const extentions = editor.assets.list().filter((data) => {
      const { path, type } = data.json();
      return type === "script";
    });

    extentions.forEach((data) => {
      const { url } = data.json().file;
      var script = document.createElement("script");
      script.src = url;
      console.log(url)
      document.head.appendChild(script);
    });
  };

  editor.on('assets:load', () => importExtensionsFromAssets());

})();
