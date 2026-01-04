// ==UserScript==
// @name        Code enforcement search link - hcpao.org
// @namespace   Violentmonkey Scripts
// @match       *://*.hcpao.org/Search/Parcel/*
// @include     *://hcpao.org/Search/Parcel/*
// @grant       none
// @version     1.1
// @author      Ryan McLean
// @description 5/30/2023, 22:56:47 PM
// @license MIT
// ==/UserScript==

const parcelId                    = $("title").text().split(" - ")[0];
const linksContainer              = $("div.container.body-content").find("div.row:eq(1)").find("div:eq(1)");
const codeEnforcementSearchForm   = $(`
  <form method="POST" action='http://permits.hcbcc.org/eGovPlus90/property/prop_search_res.aspx' id='codeSearchForm' name='codeSearchForm' target='_blank'>
    <input type='hidden' name='parcel_id' value='${parcelId}' />
    <input type='hidden' name='owner' value='' />
    <input type='hidden' name='house_num' value='' />
    <input type='hidden' name='street' value='' />
    <input type='hidden' name='prop_srh' value='SEARCH' />
  </form>
`)

$("body").append(codeEnforcementSearchForm);
const codeEnforcementLink        = linksContainer.append(` | `).append(`<a href="#" target="codesearch" onClick="document.forms['codeSearchForm'].submit(); return false;">Code Enforcement Search</a>`);