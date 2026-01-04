// ==UserScript==
// @name         页面合并器（PageMerger）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从链接列表中获取和合并页面，并将每个页面的主要内容放入一个页面中！fetch and merge pages from urls and put main content of each page into one page!
// @author       ghosttk
// @match        */*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461628/%E9%A1%B5%E9%9D%A2%E5%90%88%E5%B9%B6%E5%99%A8%EF%BC%88PageMerger%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/461628/%E9%A1%B5%E9%9D%A2%E5%90%88%E5%B9%B6%E5%99%A8%EF%BC%88PageMerger%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    initialize()
})();

function initialize(){
    const aDiv = createDiv()
    setStyleSheet()
    document.querySelector('body').prepend(aDiv)
}

function getAnchors(){
  const anchors = $x('//a')
  //const groups = anchors.reduce(groupReducer, [])
  const groups = groupBy(anchors, 'parentElement')
}

function createDiv(){
    const aDiv = wwCE('div', {'id': 'PageMergerDiv'})
    aDiv.style.backgroundColor = '#ffffff'
    const aHeader = wwCE('sidebar', {'innerText': 'PageMerger(页面合并器):'})
    aDiv.append(aHeader)
    const cbList = wwCE('input', {'type': 'checkbox', 'id': 'ShowLists'})
    const labelList = wwCE('label', {'innerText': `${cbList.id}(显示列表)`, 'htmlFor': cbList.id , 'className': 'btnLike' })
    labelList.style.margin = '0px 12px 0px  0px'
    aDiv.append(cbList)
    aDiv.append(labelList)
    const startListBtn = wwCE('input', {'type': 'button', 'value': 'startList(全部合并)', 'disabled': 'true'})
    startListBtn.addEventListener('click', onStartList)
    aDiv.append(startListBtn)
    //const fieldset = getLists( '//ul | //ol' )
    const fieldset = getLists( '//div ' )
    fieldset.style.display = 'none'
    aDiv.append(fieldset)
    cbList.addEventListener('click', x => {
        fieldset.style.display = x.target.checked ? '' : 'none'
        startListBtn.disabled = x.target.checked ? '' : 'none'
    })
    return aDiv
}

function setStyleSheet(){
    // Create a new style tag
    const style = document.createElement("style");
    // Append the style tag to head
    document.head.appendChild(style);
    // Grab the stylesheet object
    const sheet = style.sheet
    // Use addRule or insertRule to inject styles
    sheet.insertRule('input[type="checkbox"] { margin: 0px 0px 0px 10px; display:inline}')
    sheet.insertRule('legend {background-color:SkyBlue; }')
    sheet.insertRule('label {display: inline; }')
    sheet.insertRule('input[type="button"] { background-color:DodgerBlue; color:White;}')
    sheet.insertRule('.btnLike { background-color:Salmon; color:Black; border:solid Blue; display:inline}')
}

//traverse all anchros from given elements and create fieldsets
function getLists( xpathParent ){
    //const uls = $x('//ul[//a] | //div[//a]')
    const uls = $x( xpathParent )
    console.log(uls)
    const outerField = wwCE('fieldset', {'id': 'urllist'})
    for(let i=0; i<uls.length; i++){
        const fieldset = wwCE('fieldset', {'id': `fieldset-group-${i}`})
        fieldset.style.border = '1px solid'
        const legend = createGroupLegend(i)
        fieldset.append( legend )
        const items = uls[i].querySelectorAll('a')
        for(let j=0; j<items.length ; j++){
            const url = items[j].href
            let text = items[j].textContent
            const cb = wwCE('input', {'type': 'checkbox', 'className': `group-${i}`, 'id': `group-${i}-url-${j}`})
            cb.setAttribute('url', url)
            const label = wwCE('label', {'innerText':text, 'htmlFor': cb.id})
            label.style.margin = '0px 12px 0px 0px'
            fieldset.append(cb)
            fieldset.append(label)
        }
        outerField.append(fieldset)
    }
    return outerField
}

function groupReducer(prev, curr) {
      let found = 0
      for(let i=0; i<prev.length; i++){
       if(prev[i].parentElement == curr.parentElement){
           found = 1
           break
       }
      }
    //create new category
      if( !found ){
          prev.push( curr )
      }
      return prev
  }

//create sub groups
function createGroupLegend(i){
    const legend = wwCE('legend', {'id': `legend-group-${i}`})
    const cbGroup = wwCE('input', {'type': 'checkbox', 'id': `group-${i}`})
    cbGroup.addEventListener('click', onGroupClicked)
    const labelGroup = wwCE('label', {'htmlFor': cbGroup.id, 'innerText': `group-${i}(选中本组)`})
    const startGroup = wwCE('input', {'type': 'button', 'value': `StartGroup_${i}(合并本组)`})
    startGroup.addEventListener( 'click', onStartGroup )
    legend.append(cbGroup)
    legend.append(labelGroup)
    legend.append(startGroup)
    return legend
}

function onGroupClicked(){
    const checkboxes = document.querySelectorAll(`input.${this.id}`)
    for(let i=0; i<checkboxes.length; i++){
        checkboxes[i].setAttribute('checked', this.checked ? true:false)
        checkboxes[i].checked = this.checked ? true : false
    }
}

//if startLlistBtn clicked
function onStartList(){
    const rtn = []
    const className = this.className
    const urls = $x(`//input[ @type = "checkbox" and @url and @class = ${className}`)
    //const urls = $x('//input[ @type = "checkbox" and @url]')
    for(let i = 0; i < urls.length; i++){
      if(urls[i].checked) rtn.push(urls[i].getAttribute('url'))
    }
    StartCrawler( rtn )
}

function onStartGroup(){
    const rtn = []
    const urls = $x('//input[ @type = "checkbox" and @url ]')
    for(let i = 0; i < urls.length; i++){
      if(urls[i].checked) rtn.push(urls[i].getAttribute('url'))
    }
    StartCrawler( rtn )
}

//@urls array of url
function StartCrawler(urls){
    const oldBody = document.querySelector('body')
    oldBody.innerHTML = ''
    oldBody.style.backgroundColor = '#ffffff'
    for(let i=0; i<urls.length; i++){
        crawler(urls[i], text => {
            const mainContent = getMainContent(text)
            oldBody.append( mainContent )
        })
    }
}
function wwCE(element, option){
    const elem = document.createElement(element)
    for( const prop in option) {
        elem[prop] = option[prop]
    }
    return elem
}
function getMainContent( text ){
    const parser = new DOMParser()
    const DOCUMENT = parser.parseFromString(text, 'text/html')
    const elems = $x('//div[count(p) > 0 ]', DOCUMENT)
    let bigger = []
    let record = 0
    for(let el of elems ){
        const paras = el.querySelectorAll('p')
        if( record < paras.length){
            record = paras.length
            bigger = el
        }
    }
    return bigger
}

function *genParse( title ) {
    let nth = yield title
    while( nth ){
        yield getMainContent( nth )
    }
}

//find elements by xpath
function $x(STR_XPATH, DOCUMENT = document) {
    let xresult = DOCUMENT.evaluate(STR_XPATH, DOCUMENT, null, XPathResult.ANY_TYPE, null);
    let xnodes = [];
    let xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}

function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        let key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
          acc[key].push(obj)
          return acc
    }, {})
}

//send request for @url, get text response and excute @func on it
function crawler(url, func) {
    fetch(url)
        .then((response) => response.body)
        .then((rb) => {
        const reader = rb.getReader();
        return new ReadableStream({
            start(controller) {
                // The following function handles each data chunk
                function push() {
                    // "done" is a Boolean and value a "Uint8Array"
                    reader.read().then(({ done, value }) => {
                        // If there is no more data to read
                        if (done) {
                            controller.close();
                            return;
                        }
                        // Get the data and send it to the browser via the controller
                        controller.enqueue(value);
                        push();
                    });
                }
                push();
            },
        });
    })
        .then((stream) =>
              // Respond with our stream
              new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text()
             )
        .then((result) => {
        // Do things with result
        func(result)
    });
}