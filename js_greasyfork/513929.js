// ==UserScript==
// @name        SampleFocus mp3-dl
// @namespace   Violentmonkey Scripts
// @match       https://samplefocus.com/samples/*
// @grant       GM_download
// @version     1.0.1
// @author      https://github.com/fa7ad
// @description Download any sample from samplefocus (only mp3)
// @license     GPL3+
// @downloadURL https://update.greasyfork.org/scripts/513929/SampleFocus%20mp3-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/513929/SampleFocus%20mp3-dl.meta.js
// ==/UserScript==
$(function() {
  let properbtn = $('.download-link')
  let parent = properbtn.parent()
  let newbtn = properbtn.clone()
  let audsrc = $('.sample-hero-waveform-container audio').attr('src')
  newbtn.addClass("materialize-red").removeClass("download-link")
  newbtn
    .attr('href', audsrc)
    .attr('download', audsrc.split('/').at(-1).split('?').at(0))
    .attr('target', '_blank')

  $.map(newbtn.data(), function(v, k) {
    newbtn.removeAttr(`data-${k}`)
  })

  newbtn.on("click", function(e) {
    e.preventDefault()
    GM_download({
      name: newbtn.attr('download'),
      url: audsrc
    })
  })

  parent.css('display', 'flex').css('gap', '3px').append(newbtn)
})