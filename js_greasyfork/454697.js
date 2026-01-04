// ==UserScript==
// @name        TorrentBD - Easy mentioning in Shoutbox (No longer maintained)
// @namespace   Violentmonkey Scripts
// @match       https://www.torrentbd.com/*
// @match       https://www.torrentbd.me/*
// @match       https://www.torrentbd.net/*
// @match       https://www.torrentbd.org/*
// @exclude     *?account-login
// @grant       GM_addStyle
// @version     1.2.5
// @run-at 		  document-end
// @author      BENZiN
// @license		  MIT
// @description In Shoutbox, clicking on the time behind a Username will pass that username over to the Shout/Chat input making it easier to mention anyone.
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhEQ0QxMEFEM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhEQ0QxMEFFM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OERDRDEwQUIzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OERDRDEwQUMzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l3CaDAAADIUlEQVR42rRXv09aURQ+FsHWCg2RIAwSm6okJZSmi4tLKUZjw+TC6H9RN7vRTu3CYOzSxXY0JozCQgJ1KNSENKQ1jRB/1GJMKaBAyOs5z3vN8/mAdwVO8oXAu/d8H/f8uOcNgH4bQbxEPEc8RTxEPGDP/iJ+ITKIOCKKKEOPbBKxzhxKOlFmeya7Ib6LeIOoCRCrQXvfMl9C9giR7oJYjbTIaTxDHPeQnOOY+e4Y75M+kHOctDuJeyyLpT7jG+OSbVAh4DXC1+mILBYLGAwGMBqNMDw8DENDQ5eOBi9dXVxcQK1Wg3q9Do1GQ0a5fK0inzCuV/RlQJF03xHGa4U/MiKTOJ1O8Pl8MDMzA4FAAKanp3VncyaTgXg8DolEArLZLBSLRRLVKJVKj/HxT75unR8RkkpIKIVCISkWi0n9ML/fT1wfOLmZNxkiDwaDUr9tfn6eNyszBW4RcV9WYjbD1tZWT9pntVqFzc1N2N/fh7GxMZibm4Px8XEIh8Ows7MDjHORBLzgmyje3VoqlYLl5WU4OjoCjPON5FUlpcyd4vG3Wq1SpVK5cWT5fF5aXV2V8yIajbY82nQ6LfsQKEnihj/KHz0ej5x8uVxOWllZkdxut4Tqr56Pjo62FICVItoTiFvssqFETSaTmgLsdrvwZXVHNMYUv/Pzc82koyYkaiSgJLKBksnr9fZq1iiRgD2RHZTJNpvtxu+3rKA9ErArsoPugHbiBG2XBGyL7DCZTC0bT7PZFBWwfa0V68HExIRmBVCvEKyACnHTCfxDfBbJAS07ODgQ/fefiJuXIQ2fDT27+L2vtsPDQxHyBhtWgQuge/ldN/VEl46AvUf8UArgE9HubQUUCgXdmc+4QC2A2tsS78+iRrefDiPfS5izVS0BgA8oFAuI36ICzs7OOi0hnwuMAzQFMBFf8WNWNBynp6edjn2W+W5tuOAK7HWKMrWuvq61jOZIjVqv81czpW/mv70AxcIpNrRS45DnA7VFIhH5mlYQV9nQOaXlU0iAYgO9nodcLtdHnOvynHxjY6PpcDiK+OwLYo3W0Np2vpQC/gswALqtfOgnVs/UAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/454697/TorrentBD%20-%20Easy%20mentioning%20in%20Shoutbox%20%28No%20longer%20maintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454697/TorrentBD%20-%20Easy%20mentioning%20in%20Shoutbox%20%28No%20longer%20maintained%29.meta.js
// ==/UserScript==

let enableEasyMention = 1
let enableUrlBtn      = 1

//Global Styles
let css = ``

//function specific css
let easyMentionStyles = `
  .shout-user{
      user-select: none;
  }
  .chromium span.shout-time:has(+ .shout-user [href^="account"]){
      cursor: pointer;
      position: relative;
  }
  .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover{
      margin-left: -1.5em;
  }
  .chromium span.shout-time:has(+ .shout-user [href^="account"])::after{
      content: "";
      margin-left: .5em;
      height: 1em;
      rotate: 180deg;
      display: none;
      width: 1em;
  }
  .chromium span.shout-time:has(+ .shout-user [href^="account"]):hover::after{
      display: inline-block;
  }

  .firefox span.shout-time{
      cursor: pointer;
      position: relative;
  }
  .firefox span.shout-time:hover{
      margin-left: -1.5em;
  }
  .firefox span.shout-time::after{
      content: "";
      margin-left: .5em;
      height: 1em;
      rotate: 180deg;
      display: none;
      width: 1em;
  }
  .firefox span.shout-time:hover::after{
      display: inline-block;
  }

  .dark-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after{
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>');
  }
  .light-scheme.chromium span.shout-time:has(+ .shout-user [href^="account"])::after{
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>');
  }
  .dark-scheme.firefox span.shout-time::after{
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(238, 238, 238);"/></svg>');
  }
  .light-scheme.firefox span.shout-time::after{
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" style="fill: rgb(68 ,68, 68);"/></svg>');
  }
`

let urlBtnStyles = `
  #shout-ibb-container{
      display: flex;
      gap: 0 .5rem;
      margin-right: 0;
      padding-right: .5rem;
      right: 0;
      position: absolute;
  }
  #shout-send-container{
      position: relative;
  }
  #urlWindow {
      position: absolute;
      width: 100%;
      left: 0;
      flex-flow: wrap;
      bottom: 7px;
      gap: 0.5rem;
      display: flex;
      transition: visibility 0s linear .2s, opacity .1s linear .1s, translate .2s linear;
      visibility: hidden;
      background: var(--main-bg);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
        opacity: 0;

  }
  .spotlight #urlWindow{
      bottom: 28px;
  }
  #urlWindow.show{
      visibility: visible;
      translate: 0 -30px;
      transition-delay: 0s;
      opacity: 1;
  }
  .url-inputs {
      height: 37px;
      color: var(--text-color) !important;
      background: var(--main-bg);
      padding: 0px .5rem;
      border-top:1px solid var(--border-color);
      border-bottom:1px solid var(--border-color);
      border-left: none;
      border-right: none;
      outline: 0;
  }
  .spotlight .url-inputs{
      height: 60px;
  }
  .url-inputs:focus{
  }

  div#urlWindow {
  }

  #urlField {
      flex: 1 1 100%;
  }
  #labelField {
      flex: 4 1 auto;
      border-right: 1px solid var(--border-color);
  }
  #submitURL {
      flex: 1 1 auto;    background: transparent;
      border: 1px solid var(--border-color);
      border-right: none;
      color: var(--text-color);
      font-weight: 600;
      font-size: 0.9rem;
  }
  #urlBtn i{
      line-height: 37px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
      user-select: none;
  }
  input.shoutbox-text{
      width: auto !important;
  }
  input#shout_text{
      padding-right: 170px;
  }
  .spotlight input#shout_text {
      padding-left: .5rem;
      padding-right: calc(220px - .5rem);
  }
  @media(max-width: 767px){
      .spotlight input#shout_text {
          padding-right: calc(200px - .5rem);
      }
      .spotlight #shout-ibb-container{
          padding-right: .5rem;
      }
  }

`

////////////////////////////////////////////////////////////////////////////////////////////////
//Defining easyMention
const easyMention = () => {
  if (window.location.pathname !== "/") return
  css += easyMentionStyles
  const shout = document.querySelector("#shout_text")
  //Checking browser name
  if(navigator.vendor == ""){
      if (!document.body.classList.contains("firefox")) document.body.classList.add("firefox")
  } else {
      if (!document.body.classList.contains("chromium")) document.body.classList.add("chromium")
  }
  let name

  document.addEventListener("click", e => {
      if (document.body.classList.contains("chromium")){
          if (!e.target.matches(".chromium .shout-time:has(+ .shout-user [href^='account'])")) return
      } else if (document.body.classList.contains("firefox")){
          if (!e.target.matches(".firefox .shout-time")) return
      }
      //Querying username and pasting it into shout_text input field
      if (name = e.target.nextElementSibling.querySelector('[href^="account"] span')) {
          if (shout.value != "" && shout.value.slice(-1) != " ") shout.value += " "
          shout.value += "@" + name.innerText.trim() + " "
      }
  })
}

////////////////////////////////////
//Defining URL function
const urlBtn = () => {
  if (window.location.pathname !== "/") return
  css += urlBtnStyles
  if (window.location.search.includes("spotlight")) document.body.classList.add("spotlight")

  const shout     = document.querySelector("#shout_text")
  const ibbCont	  =	document.querySelector("#shout-ibb-container")
  const shoutCont = document.querySelector("#shout-send-container")

  const urlWindow = document.createElement("div")
  urlWindow.id = "urlWindow"
  shoutCont.appendChild(urlWindow)

  const showUrlWindow   = () => {
    urlWindow.classList.add("show")

    //closing other emoji windows
    shoutCont.querySelectorAll("[id^='spotlight']").forEach(spotlight => {
      if (spotlight.classList.contains("shiner")){
          spotlight.classList.remove("shiner")
          spotlight.classList.add("fader")
      }
    })
  }

  const hideUrlWindow   = () => urlWindow.classList.remove("show")

  const toggleUrlWindow = () => {
    if (urlWindow.classList.contains("show")){
      hideUrlWindow()
    } else {
      showUrlWindow()
    }
  }

  let initHeight = window.innerHeight
  window.onresize = () => {
    if (window.innerHeight < initHeight && urlWindow.classList.contains("show")) shoutCont.scrollIntoView(false)
  }

  const urlField  = document.createElement("input")
  urlField.id = "urlField"
  urlField.classList.add("url-inputs")
  urlField.placeholder = "URL"
  urlWindow.appendChild(urlField)
  urlField.onmouseover = () => urlField.focus()

  const labelField  = document.createElement("input")
  labelField.id = "labelField"
  labelField.classList.add("url-inputs")
  labelField.placeholder = "Label (Optional)"
  urlWindow.appendChild(labelField)

  const submitURL   = document.createElement("input")
  submitURL.type = "button"
  submitURL.id = "submitURL"
  submitURL.value = "Submit"
  urlWindow.appendChild(submitURL)

  const urlBtn	  =	document.createElement("span")
  urlBtn.id = "urlBtn"
  urlBtn.innerHTML = `<i class="material-icons">URL</i>`
  urlBtn.classList.add("inline-submit-btn")
  ibbCont.insertBefore(urlBtn, ibbCont.childNodes[4])

  document.addEventListener("click", e => {
    if(!e.target.matches("#urlBtn i")) return
    if (shout.value != "") shout.value += " "
    toggleUrlWindow()
    urlField.focus()
  })

  document.addEventListener("click", e => {
    if(!e.target.matches(".inline-submit-btn:not(#urlBtn) i")) return
    hideUrlWindow()
  })

  const clearFields = () => {
    urlField.value = ""
    labelField.value = ""
  }

  const urlTagCreate = () => {
    let rawURL  =  urlField.value.trim()
    let label   =  labelField.value

    //url checks
    if (rawURL.length > 150)                      return "URL is too long.\nConsider shortening it using URL shorteners."
    if (!/^https:\/\//i.test(rawURL))             return "Please enter a safe https URL."
    if (!/^https:\/\/.*\./i.test(rawURL))         return "Please make sure the URL is correct."

    //Submitting url
    if (shout.value != "" && shout.value.slice(-1) != " ") shout.value += " "

    if (label != ""){
        shout.value += `[url=${rawURL}]${label}[/url] `
    } else {
        shout.value += `[url]${rawURL}[/url] `
    }
    hideUrlWindow()
    clearFields()
    shout.focus()
  }

  submitURL.onclick = () => {
    let error = urlTagCreate()
    if (typeof error != "undefined" || error != null){
      alert(error)
      clearFields()
    }
  }
  document.addEventListener("keypress", e => {
    if (e.target.matches(".url-inputs")){
      if (e.key === "Enter"){
          let error = urlTagCreate()
          if (typeof error != "undefined" || error != null){
            alert(error)
            clearFields()
          }
      }
    }
  })

}

////////////////////////////////////////////////////////////////////////////////////////////////
//Function calls

if (enableEasyMention) easyMention()
if (enableUrlBtn) urlBtn()
//appending css to the document
if (typeof css !== "undefined" || css !== null){
  if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css)
  } else {
      let styleNode = document.createElement("style")
      styleNode.appendChild(document.createTextNode(css))
      ;(document.querySelector("head") || document.documentElement).appendChild(styleNode)
  }
}

////////////////////////////////////
//Some extras

// Making sure On Screen Keyboard shows Capital letters at the start of sentences (beta)
document.querySelector("#shout_text")?.setAttribute("autocapitalize", "on")

//Adding meta for Iceberg Android to fix auto zoom issues
document.querySelector("meta[name='viewport']")?.setAttribute("content", "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no")







