// ==UserScript==
// @name         Asana - Hide Empty Columns
// @version      0.2
// @description  Removes empty tasks columns in Asana.
// @author       You
// @match        https://app.asana.com/*
// @grant        none
// @namespace 	 https://greasyfork.org/users/1038842
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461476/Asana%20-%20Hide%20Empty%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/461476/Asana%20-%20Hide%20Empty%20Columns.meta.js
// ==/UserScript==

let isDragging = false;
let needsEnable = false;
let dragCache = undefined;
let retry = 3

function getDraggedElement() {
 	let draggedElements = document.getElementsByClassName("is-dragging");
  let draggedElement = undefined;
  if (draggedElements.length > 0) {
    draggedElement = draggedElements[0];
    if (dragCache == undefined) {
     	dragCache = draggedElement; 
    }
  }
  return draggedElement;
}

function whileDragging() {
  let draggedElement = getDraggedElement();
  
  if (draggedElement == undefined && retry > 0) {
   	retry -= 1
   	draggedElement = dragCache;
  } else {
   	retry = 3
  }
  
  if (draggedElement != undefined) {
   	let dragging = draggedElement.classList.contains("is-dragging");

    if (!dragging) {
      isDragging = false;
    }
    
    if (isDragging) {
      setTimeout(whileDragging, 1000);
    } else {
      updateLists();
    }
  }
  
  if (retry == 0) {
    dragCache = undefined;
    isDragging = false;
    updateLists();
  }
}

function checkIsDragging() {
 	// check if card is being dragged: is-dragging class
  let draggedElement = getDraggedElement();
  
  if (draggedElement != undefined) {
    console.log("Dragging started");
    retry = 3
    isDragging = true;
  }
}

function updateLists() {
  let lists = document.getElementsByClassName("BoardBody-columnDraggableItemWrapper SortableList-sortableItemContainer");
  
  for (let list of lists) {
   	let containsEmptyList = list.getElementsByClassName("is-empty").length > 0;
    
    if (containsEmptyList) {
      list.style.display = "none";
    } else {
     	list.style.display = "flex";
    }
  }
  
  checkIsDragging();
  
  if (isDragging) {
    needsEnable = true;
    for (let list of lists) {
     	 list.style.display = "flex";
    }
    //setTimeout(checkIsDragging, 50);
    setTimeout(whileDragging, 50);
  } else {
    setTimeout(updateLists, 50);
  }
}

updateLists();