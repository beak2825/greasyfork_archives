// ==UserScript==
// @name        Return Pagination to Google
// @description Makes Google searches break down into separate pages, rather than displaying as one continuous page.
// @namespace   Violentmonkey Scripts
// @include     https://www.google.*/search*
// @match       https://www.google.com/search*
// @grant       none
// @version     1.5
// @author      Jupiter Liar
// @license     Attribution CC BY
// @description 03/17/2024, 11:15 PM
// @downloadURL https://update.greasyfork.org/scripts/468360/Return%20Pagination%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/468360/Return%20Pagination%20to%20Google.meta.js
// ==/UserScript==

// Function to generate links for the page numbers
function generatePageLink(urlWithoutAnchor, startParam, startValue, newStartValue) {
  if (newStartValue === 0) {
    newStartValue = '0';
  }
  var linkHref;
  if (startIndex === -1) {
    linkHref = urlWithoutAnchor + startParam + newStartValue;
  } else {
    linkHref = urlWithoutAnchor.replace(startParam + startValue, startParam + newStartValue);
  }
  return linkHref;
}

  var botstuffDiv = document.getElementById('botstuff');
  var footerElement = document.querySelector('footer');

// Extract the page number from the URL
var startParam = "&start=";
var startIndex = window.location.href.indexOf(startParam);

// Create a variable to store the page number
var pageNumber;

function generateTable() {
  // Create the table element
  var table = document.createElement('table');
  table.className = 'AaVjTc return-pagination';
  table.style.margin = 'auto';
  table.style.marginBottom = '28px';
  // table.style.scale = '80%';
  table.style.border = '1px solid hsla(0, 0%, 0%, 10%)';
  table.style.borderRadius = '1em';

  if (footerElement) {
    table.style.marginTop = '28px';
  }

  if (!botstuffDiv) {
    table.style.padding = '0.4em';
  } else {
    table.style.padding = '0 0.5em';
  }



  if (startIndex === -1) {
    pageNumber = 1;
  } else {
    var startValue = parseInt(window.location.href.substring(startIndex + startParam.length));
    pageNumber = Math.floor(startValue / 10) + 1;
  }

  // Remove the anchor portion from the URL
  var urlWithoutAnchor = window.location.href.split("#")[0];

  // Create the table columns
  for (var i = 0; i < 11; i++) {
    var column = document.createElement('td');
    column.style.textAlign = 'center';
    column.style.verticalAlign = 'middle';
    column.style.minWidth = '16px';
    column.style.fontSize = '16pt';

    // Add padding to middle columns
    if (i > 0 && i < 10) {
      if (botstuffDiv) {
        column.style.padding = '0pt 6.4pt 0';
      } else {
        column.style.padding = '1pt 6.4pt 0';
      }
    }

    // Add padding to previous and next columns
    if (i === 0) {
      column.style.padding = '0 12.8pt 0 0';
    }

    if (i === 10) {
      column.style.padding = '0 0 0 12.8pt';
    }

    // Add content to the columns
    if (i === 0) {
      if (pageNumber !== 1) {
        var previousLink = document.createElement('a');
        previousLink.href = urlWithoutAnchor.replace(startParam + startValue, startParam + (startValue - 10));
        var previousSpan = document.createElement('span');
        previousSpan.style.padding = '0 12.8pt 0 6.4pt'; // Changed from '0 8pt' to '0 16pt'
        previousSpan.style.fontSize = '22.4pt';
        previousSpan.style.verticalAlign = 'middle'; // Added vertical-align style
        previousSpan.innerText = '<';
        previousLink.appendChild(previousSpan);
        var previousTextSpan = document.createElement('span');
        previousTextSpan.style.verticalAlign = 'middle'; // Added vertical-align style
        previousTextSpan.innerText = 'Previous';
        previousLink.appendChild(previousTextSpan);
        column.appendChild(previousLink);
      }
    } else if (i === 10) {
      var nextLink = document.createElement('a');
      var nextStartValue = (pageNumber) * 10;
      if (startIndex === -1) {
        nextLink.href = urlWithoutAnchor + startParam + nextStartValue;
      } else {
        nextLink.href = urlWithoutAnchor.replace(startParam + startValue, startParam + nextStartValue);
      }
      var nextTextSpan = document.createElement('span');
      nextTextSpan.style.verticalAlign = 'middle'; // Added vertical-align style
      nextTextSpan.innerText = 'Next';
      nextLink.appendChild(nextTextSpan);
      var nextSpan = document.createElement('span');
      nextSpan.style.padding = '0 6.4pt 0 12.8pt'; // Changed from '0 8pt' to '0 16pt'
      nextSpan.style.fontSize = '22.4pt';
      nextSpan.style.verticalAlign = 'middle'; // Added vertical-align style
      nextSpan.innerText = '>';
      nextLink.appendChild(nextSpan);
      column.appendChild(nextLink);
    } else {
      // Calculate the page number for the column
      var columnNumber;
      if (pageNumber < 5) {
        columnNumber = i;
      } else if (pageNumber >= 5) {
        columnNumber = pageNumber - 5 + i;
      }

      if (columnNumber === pageNumber) {
        // Add page number without link
        column.innerText = columnNumber;
      } else {
        // Generate links for the page number
        var newStartValue = (columnNumber - 1) * 10;
        var linkHref = generatePageLink(urlWithoutAnchor, startParam, startValue, newStartValue);

        // Create the link element
        var link = document.createElement('a');
        link.href = linkHref;
        link.innerText = columnNumber;

        // Append the link to the column
        column.appendChild(link);
      }
    }

    // Add class to the column
    column.classList.add(`ret-pag-col-${i + 1}`);

    // Append the column to the table
    table.appendChild(column);
  }

  // Check if the first column is empty and delete it
  var firstColumn = table.querySelector('td:first-child');
  if (firstColumn.innerText === '') {
    table.removeChild(firstColumn);
  }

  // Append the table to the 'botstuff' div or the beginning of the footer element


  if (botstuffDiv) {
    botstuffDiv.appendChild(table);
  }

  if (footerElement) {
    footerElement.insertBefore(table, footerElement.firstChild);
  }

}


// Check if the page has the required conditions
if ((botstuffDiv && !document.querySelector('table.AaVjTc')) || footerElement) {
  console.log('Attempting to generate table...');
  generateTable();
}


// ...



// Check if the page has the required conditions
if (document.getElementById('botstuff')) {
  var botstuffDiv = document.getElementById('botstuff');
  var divsToHide = botstuffDiv.querySelectorAll('div[jscontroller="ogmBcd"]');
  for (var i = 0; i < divsToHide.length; i++) {
    divsToHide[i].style.display = "none";
  }
}


// Function to hide elements with class "C4clhf"
function hideElementWithClass(className) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
}

// Function to handle mutations and hide elements
function handleMutations(mutationsList) {
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    var addedNodes = mutation.addedNodes;
    for (var j = 0; j < addedNodes.length; j++) {
      var addedNode = addedNodes[j];
      if (addedNode.classList && addedNode.classList.contains("C4clhf")) {
        hideElementWithClass("C4clhf");
      }
    }
  }
}

// Create a new mutation observer
var observer = new MutationObserver(handleMutations);

// Start observing the 'search' div and its descendants
var searchDiv = document.getElementById('search');
if (searchDiv) {
  observer.observe(searchDiv, { childList: true, subtree: true });
}

// Hide existing elements with class "C4clhf"
hideElementWithClass("C4clhf");







if ((document.querySelector('div.card-section a[href*="&filter=0"]') !== null) ||
  (document.querySelectorAll('div.card-section p, div.card-section li').length > 1) ||
  (document.querySelector('div.uzjuFc') !== null)) {

  if (pageNumber === 1) {
    // Remove the 'return-pagination' table if pageNumber is 1
    var returnPaginationTable = document.querySelector('table.AaVjTc.return-pagination');
    if (returnPaginationTable) {
      returnPaginationTable.remove();
    }
  } else {
    // Find and remove the column ret-pag-col-11
    var column11 = table.querySelector('.ret-pag-col-11');
    if (column11) {
        column11.remove();
    }

    // Remove numbers and links from columns ret-pag-col-2 to ret-pag-col-10
    for (var i = 2; i <= 10; i++) {
        var column = table.querySelector(`.ret-pag-col-${i}`);
        column.innerHTML = '';
    }

    // Set the current page number in ret-pag-col-10
    var column10 = table.querySelector('.ret-pag-col-10');
    column10.innerText = pageNumber;

    // Generate and set the page numbers in the remaining columns as links
    for (var i = 9; i >= 2; i--) {
        var column = table.querySelector(`.ret-pag-col-${i}`);
        var columnNumber = pageNumber - (10 - i);
        if (columnNumber > 0) {
            var linkURL = getCurrentPageURL();
            var newStartNumber = (columnNumber - 1) * 10;
            linkURL = replaceStartNumber(linkURL, newStartNumber);
            column.innerHTML = generateLink(columnNumber, linkURL);
        } else {
            column.remove();
        }
    }
}

// Function to get the current page URL
function getCurrentPageURL() {
    return window.location.href.split("#")[0];
}

// Function to replace the "start" number in the URL
function replaceStartNumber(url, newStartNumber) {
    return url.replace(/([&?])start=\d+/, "$1start=" + newStartNumber);
}

// Function to generate a link with the specified page number and URL
function generateLink(pageNumber, url) {
    return `<a href="${url}">${pageNumber}</a>`;
}

}


// Function to handle scaling and transforming the table
function scaleTableToFit(tableContainerDiv) {
  var table = document.querySelector('.return-pagination');
  var viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (table.offsetWidth > tableContainerDiv.offsetWidth) {
    var scale = tableContainerDiv.offsetWidth / table.offsetWidth;
    table.style.transform = 'scale(' + scale + ')';
    table.style.transformOrigin = 'top left';
  } else {
    // Reset the table's scale and transform origin
    table.style.transform = '';
    table.style.transformOrigin = '';
  }
}

// Create a ResizeObserver instance
var resizeObserver = new ResizeObserver(function(entries) {
  for (var entry of entries) {
    if (entry.target.id === 'botstuff') {
      tableContainerDiv = botstuffDiv;
      // Call the scaling function when #botstuff width changes
      scaleTableToFit(tableContainerDiv);
      console.log('Botstuff resizer in action.');
      break;
    }

    if (footerElement) {
      tableContainerDiv = footerElement;
      // Call the scaling function when <footer> width changes
      scaleTableToFit(tableContainerDiv);
      console.log('Footer resizer in action.');
      break;
    }
  }
});

// Observe changes in the width of #botstuff
if (botstuffDiv) {
  resizeObserver.observe(botstuffDiv);
}

if (footerElement) {
  resizeObserver.observe(footerElement);
}
