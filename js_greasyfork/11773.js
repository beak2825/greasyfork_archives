// ==UserScript==
// @name          zelluloza_one_list
// @namespace     https://zelluloza.ru/grub
// @description   Books in one list
// @include       https://zelluloza.ru/books/*
// @include       http://zelluloza.ru/books/*
// @version 0.1
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/11773/zelluloza_one_list.user.js
// @updateURL https://update.greasyfork.org/scripts/11773/zelluloza_one_list.meta.js
// ==/UserScript==

var isStoped = false;

/*
 * copy book window
 */
var bookBlock = document.createElement('div');

bookBlock.style.width = '800px';
bookBlock.style.height = '200px';
bookBlock.contentEditable = 'true';
bookBlock.style.overflow = 'scroll';
bookBlock.style.resize = 'both';
bookBlock.hidden = true;
bookBlock.style.border = '2px solid white';

/*
 * copy book menu
 */
var copyMenu = document.createElement('div');

copyMenu.innerHTML = 'CopyBook: ';
copyMenu.style.position = 'fixed';
copyMenu.style.zIndex = 999;
copyMenu.style.display = 'block !important';
copyMenu.style.border = '4px solid yellow';
copyMenu.style.backgroundColor = "black";
copyMenu.style.color = 'white';
copyMenu.style.width = '100%';
copyMenu.id = 'oneListMenu';

/*
 * flip button
 */
var flipButton = document.createElement('button');

flipButton.innerHTML = 'Flip copy';
flipButton.onclick = function() {
  flipBookBlock();
};

/*
 * clear button
 */
var clearButton = document.createElement('button');

clearButton.innerHTML = 'Clear';
clearButton.onclick = function() {
  clearCopyBook();
};

/*
 * input field for dellay
 */
var dellayInput = document.createElement('input');
var dellayField = document.createElement('span');
var dellayName = document.createElement('span');

dellayName.innerHTML = 'dellay: ';

dellayField.appendChild(dellayName);
dellayField.appendChild(dellayInput);

dellayField.type = 'number';
dellayInput.defaultValue = 1500;

/*
 * run button
 */
var runButton = document.createElement('button');

runButton.innerHTML = 'Run';
runButton.id = 'oneListButton';

runButton.onclick = function() {
  clearCopyBook();
  setTimeout(function() { inBookBegin() }, 2000);
  setTimeout(function() { copyBook(getBookCanvas(), 0) }, 4000);
  isStoped = false;
  changeStatus(statusVal.running);
};

/*
 * interrupt button
 */
var stopButton = document.createElement('button');

stopButton.innerHTML = 'Stop';
stopButton.onclick = function() {
  isStoped = true;
};

/*
 * status
 */
var statusBar = document.createElement('span');
var statusName = 'status: ';
var statusVal = {
  'stopped' : 'stopped',
  'running' : 'running',
  'done' : 'done'
};

statusBar.style.color = 'orange';
statusBar.style.border = '3px solid grey';

var progressBar = document.createElement('span');
var progressBarName = 'progress: ';

progressBar.style.color = 'orange';
progressBar.style.border = '3px solid grey';
setProgress('none');

/*
 * flip
 */
function flipBookBlock() {
    if(bookBlock.hidden)
      bookBlock.hidden = false;
    else bookBlock.hidden = true;
}

function createControlMenu() {
  copyMenu.appendChild(runButton);
  copyMenu.appendChild(stopButton);
  copyMenu.appendChild(flipButton);
  copyMenu.appendChild(clearButton);
  copyMenu.appendChild(dellayField);
  copyMenu.appendChild(statusBar);
  copyMenu.appendChild(progressBar);
  copyMenu.appendChild(bookBlock);
  addElemToBody(copyMenu);
  changeStatus(statusVal.stopped);
}

function getBookProgress() {
  return document.getElementById('bookpg').innerHTML;
}

function changeStatus(status) {
  statusBar.innerHTML = statusName + status;
}

function setProgress(progress) {
  progressBar.innerHTML = progressBarName + progress;
}

function addElemToBody(newElem) {
  var bodyTag = document.getElementsByTagName('body')[0];
  var bodyTagChilds = bodyTag.getElementsByTagName('*');
  
  bodyTag.insertBefore(newElem, bodyTagChilds[0]);
}



function getBookCanvas() {
  var pagesCanvas = document.getElementsByTagName('canvas')[0];
  
  console.log('get canvas id: ' + pagesCanvas.id);
  
  return pagesCanvas;
}


function getImgFromCanvas(bookCanvas) {
  var img = bookCanvas.toDataURL();
  
  return img;
}

function toNextPageDown() {
  var rightButton = document.getElementsByClassName('boxb2')[1];
  
  rightButton.click();
  console.log('toNextPageDown');

}

function rexp100Perc(str) {
  var re = /100\%.*/;
  
  console.log('100 perc is ' + re.test(str) );
  return re.test(str);
}

function lastPage() {
  var progressText = getBookProgress();
  var arr = progressText.split('/');
  var leftPageNum = +arr[0].split('-')[1];
  var rightPageNum = +arr[1];
  
  console.log('leftPageNum ' + leftPageNum);
  console.log('rightPageNum ' + rightPageNum);
  return leftPageNum === rightPageNum;
}

function isPageEnd() {
  var progressText = document.getElementById('bookpg').innerHTML;
  var isEnd = rexp100Perc(progressText);
  
  console.log('is end ' + isEnd);
  return isEnd;
}

function clearCopyBook() {
  bookBlock.innerHTML = "";
}

function inBookBegin() {
  var beginButton = document.getElementsByClassName('boxb3')[0];
  beginButton.click();
}

function copyBook(bookCanvas, i) {  
  if(isStoped) {
    changeStatus(statusVal.stopped);
    return;
  }
  
  setProgress(getBookProgress());

  copyPage(bookCanvas, i);

  console.log('page numb: ' + i);

  if( !lastPage() ) {
    setTimeout(function() {
        toNextPageDown();
        i++;
        copyBook(bookCanvas, i);
      }, dellayInput.value);
  } else {
    setTimeout(function() { changeStatus(statusVal.done) }, 2100);
  }

}

function copyPage(bookCanvas, i) {
  var image = new Image();

  image.id = i;
  image.src = getImgFromCanvas(bookCanvas);
  printPage(image);
}

function printPage(page) {
  bookBlock.appendChild(page);
  
}


function testBlock() {
  lastPage();
}

window.onload = function() {
  testBlock();
  createControlMenu();
  
};
