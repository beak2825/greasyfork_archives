// ==UserScript==
// @name Civitai script
// @namespace http://tampermonkey-script-exemple
// @version 1.3.1.1
// @description Save information when a page is loaded in a same place, then we download content, generate json with alls informations
// @match https://civitai.com/models/*
// @match https://civitai.com*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @author viatana35
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464079/Civitai%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/464079/Civitai%20script.meta.js
// ==/UserScript==

function addCloseTabOption() {
    let closeTab = GM_getValue('closeTab', false);

    GM_registerMenuCommand('Close Tab', () => {
    closeTab = !closeTab;
    GM_setValue('closeTab', closeTab);

    const statusMessage = closeTab ? 'enabled' : 'disabled';
    console.log(`Close tab option is now ${statusMessage}.`);
  });
    console.log("closetab");
  return closeTab;
}


async function findLinks() {
  const links = document.querySelectorAll('a');
  const results = [];

  links.forEach(link => {
    if (link.classList.contains('mantine-UnstyledButton-root', 'mantine-Button-root') &&
        link.type === 'button' &&
        link.getAttribute('data-button') === 'true' &&
        link.getAttribute('download') === '') {

      const hrefParts = link.href.split('/');
      const lastPart = hrefParts[hrefParts.length - 1];

      results.push({ href: link.href, id: lastPart });
    }
  });

  return results[0];
}

async function saveLinks() {
  const closeTab = addCloseTabOption();
  const currentLinks = await findLinks();
  const storedLinksJSON = await GM_getValue('storedLinks', '[]');
  const storedLinks = JSON.parse(storedLinksJSON);

  if (storedLinks.some(link => link.id === currentLinks.id)) {
    console.log('Link already stored');
    if (closeTab) {
        window.close(); // Close the current tab
    }
    else
    {
        return;
    }
    
  }

  const newLinks = [...storedLinks, currentLinks];
  await GM_setValue('storedLinks', JSON.stringify(newLinks));
  if (closeTab) {
    window.close(); // Close the current tab
  }
}

function clickPreview() {
    // get all elements with class 'mantine-Alert-root'
    const alertElements = document.querySelectorAll('.mantine-Alert-root');

    //if there are no alert elements, return
    if (!alertElements.length) {
        return false;
    }
    else {
        // loop through all alert elements
        alertElements.forEach(alertElement => {
        // find the span element within the alert element
        const spanElement = alertElement.querySelector('span');

        // click on the span element, if found
        if (spanElement) {
            //if the texte of the span cntain : 'Notify me when it's available.'
            if(spanElement.textContent == 'Notify me when it\'s available.'){
                spanElement.click();
            }
        }
        });
        //make an alert to show that the element has been added to the waitlist )
        //alert('element added to waitlist');
        return true;
    }
}




window.addEventListener('load', function() {
  if (window.location.href.startsWith('https://civitai.com/models/'))
  {
      if (!clickPreview())
      {
          saveLinks();
          // Creation of the button to download the stored content
          const header = document.querySelector('header');
          const downloadButton = document.createElement('button');
          downloadButton.className = 'mantine-Button-inner';
          downloadButton.textContent = 'Download stored content';
          downloadButton.addEventListener('click', async () => {
              const storedLinksJSON = await GM_getValue('storedLinks', '[]');
              const storedLinks = JSON.parse(storedLinksJSON);
              const data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storedLinks));
              const link = document.createElement('a');
              link.setAttribute('href', data);
              link.setAttribute('download', 'storedLinks.json');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          });
          header.appendChild(downloadButton);

          // Creation of the button to clear the stored content
          const clearButton = document.createElement('button');
          clearButton.className = 'mantine-Button-inner';
          clearButton.textContent = 'Erase Stored Content';
          clearButton.addEventListener('click', () => {
              if (confirm('Are you sure you want to erase stored content?')) {
                  GM_setValue('storedLinks', '[]');
              }
          });
          header.appendChild(clearButton);

          // Creation of the button to delete this page
          const deletePageButton = document.createElement('button');
          deletePageButton.className = 'mantine-Button-inner';
          deletePageButton.textContent = 'Delete this page';
          deletePageButton.addEventListener('click', async () => {
              const currentLinks = await findLinks();
              const storedLinksJSON = await GM_getValue('storedLinks', '[]');
              const storedLinks = JSON.parse(storedLinksJSON);

              const index = storedLinks.findIndex(link => link.id === currentLinks.id);
              if (index > -1) {
                  if (confirm('Are you sure you want to delete the stored content of this page?')) {
                      storedLinks.splice(index, 1);
                      await GM_setValue('storedLinks', JSON.stringify(storedLinks));
                  }
              } else {
                  alert('There is no stored content for this page.');
              }
          });
          header.appendChild(deletePageButton);
      }
      else
      {
          const closeTab = addCloseTabOption();
            if (closeTab) {
                window.close(); // Close the current tab
            }
      }
  }
  else
  {
     addCloseTabOption();
  }

});


