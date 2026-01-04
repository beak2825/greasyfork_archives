// ==UserScript==
// @name         MAL: Filter Voice Acting Roles by Main/Supporting
// @description  Adds an option to filter Voice Acting roles by type on MAL
// @match        https://myanimelist.net/people/*
// @version      1.0.3
// @namespace https://greasyfork.org/users/814145
// @downloadURL https://update.greasyfork.org/scripts/432209/MAL%3A%20Filter%20Voice%20Acting%20Roles%20by%20MainSupporting.user.js
// @updateURL https://update.greasyfork.org/scripts/432209/MAL%3A%20Filter%20Voice%20Acting%20Roles%20by%20MainSupporting.meta.js
// ==/UserScript==
 
 
const TYPES =
  ['Main', 'Supporting']
 
 
const qs =
  document.querySelector.bind (document)
 
 
const qsa =
  document.querySelectorAll.bind (document)
 
 
const getRoles = () =>
  [...qsa ('.js-table-people-anime > tbody > tr')]
 
 
const roleContainsType = type => r =>
  r.querySelector ('[align="right"] > :nth-child(2)').innerText.includes (type)
 
 
const getSpecificRoles = type =>
  getRoles ().filter (roleContainsType (type))
 

const addCheckbox = type =>
  qs ('.navi-people-character').insertAdjacentHTML
    ( 'afterbegin'
    , `<input type="checkbox" id="toggle-${type}" checked>
       <label for="toggle-${type}">${type}</label>`
    )
 

// I'm using a roundabout way of hiding things
// to not conflict with the website's other filters
const changeRoleDisplay = bool => role =>
  ( role.style.position = bool ? 'static' : 'absolute'
  , role.style.left = bool ? 'unset' : '-99999px'
  )
 
 
const changeTypeVisibility = type => bool =>
  getSpecificRoles (type).forEach (changeRoleDisplay (bool))
 
 
const initCheckbox = type =>
  qs (`#toggle-${type}`).onchange = () =>
    changeTypeVisibility (type) (qs (`#toggle-${type}`).checked)
 
 
const main =
  ( TYPES.forEach (addCheckbox)
  , TYPES.forEach (initCheckbox)
  )
