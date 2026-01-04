// ==UserScript==
// @name           Amazon - Offer page links
// @description    Add link to offer page in item descriptions
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        1.2.0
// @iconURL        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTJDBGvsAAAHvklEQVR4Xu1bPUwbSRROkQtg4/UP/sf2Yrz+Y0OMIUD4SezodDJFDiW6IEUiihSRComCjpImSoeEdNaBvQ7cWbm7+HQFDUpHR0fpjo7OHcopu77CvveWgUtgbO8S4zVSPumThT3z9s2bN++9mR1ufEMLsL6+zoxOTKR6HI4Vp8tVcLjdB991dhZdHk/VYrNV7S5X1WAyHcHvB87e3oLeaFyeSkwld3d3O4iI64n43buzDpdrp0OnO77Z0VFVS53BUOplWSEWi/FE5PXAwMDALGM2F2mDugw7dboqeEuB4zgbeUR7YmZmhgF3LtAG0Qx26fWl4dHRFHlceyGRSHh0DNO0Wa9FWE5SIBxuLyNMT0/bwE2vfPCnZEwmaXh4OEAerz2cbvceTdGrJD6TPF5bRHh+kaZgKzg5OTlB1NAGS0tLHXqGOaIpV4uQ/6smi+UQo3owEhFYv79gsVoP8Xta+3q0Ohxpooo28HPcc5pitdhjs+0/ePCAOms8zyf1BsMhrV8t9jjsh6S7NrA7nR9oitHoYdkdqAjrVnaQRj1QESoumiAjVLHKJN1bCyxTu41GiabYeXbDMoEiRlFZ6w8EVmkyajH1Y0qbKvGnZ894mkI09nq9K6RbQzx++nSCJqMW4/G4NoEQ3dnt9e5BvU5V7JQY3EanplTNElR8VFk0TicSc6Sbdnjx4gUP1VmSC4UWAsHgKsx4GgxTsDkcRZ/f/4Y0Uwyb00kdLI1DQ0PaG6DZgO0ydbA0fjPAdTcAFFOe2xDIYKnM3RkZWTH29KwajEbqYGm8NgZ49OjRBNQCi70+X9pqt++ZrNYjo8VCHZQatq0B5ufnGagUF2DAH2CgiuqFy7DtDPDkyRMPZoHLHoOpZVsZADY2y516fUsGfsq2MACWuZC7d2gKXjU1NwAOHmZd8aaIRtzUwNYWj8ePb3Z2FvFvWjsaNTcAzLzqQ1DYRFUZs3kHguQy1vLnd3TXpg7g79xZoClVi7e6uqp2t1sYSyQ8RAQV18IAeBqk6+5WfBp0q7NT4sJhRcpeCwM4XC5Vs9/PcYq3xD12O1UGjdoZwO0+oClEoxmqPtJNEfQMQ5VDoyYGAPdnGp0DfM7+QGCNdG2I169f22gyalETA4R5PkVTphYh2itWcnRyUtWJ0MDgYOsNoPZdAO72SNeGcLrdqmR7fL4F0rV1wFMfmjK1GIvFkqRrQ1hsNlVvmVwej+Ll1TR4WVaVAWCvr2iWotEoj7UCTUYtQoAtku6tw2AspsoAeOuDdK0LSK37tP71iIeusZERxR7WFHChkKo3QrBXkHier/s2NxaPp2l9lRCWzQER0xqkUilVkRqpNxqLY2NjF0pgTKlsX59wmXeDn9PV27tKRLYGsKFRve/HN0mwHIRQJLKIccHl9aZNVmtTzg+6ururLMu27iUJuF2epoiWhHqjdXcGxqemkl/rtvWoNhsgMT0T9VoDq8NxJadAXQZDaXx8PMmYzSXa7+eJ7j9w+7bizVbTkJiZ8UBwU6SkUhrN5qPTd4mD8fhsIy/rZhgpPDAwKyukBcwOB9+h0zXFCBAg9/HCFREtw+3zrdHaIhmTqRQZHBwmTbXDw4cPeVNPj+Lt8XlidoDagurCeA+hPxi8cOYIgy8+fvy4fW6KITC9Wex2xddcTBZLye52v5l/9aruERkawcOyZ1kHyt+9ly9ftu+t0Xv37w/jgafN6RQgQBVgiRTw02AyFaDcTbN+/+L3qZTq8vXu+PhzqCgXlhpctUGUt0d58c9kqvzXD3NifipZ+WOysbdUMr0eSQjtVbbb6BKiCpSF8JyUi+6JG75jacNbvcBMoCRu1dk3VNa5DjEbKoqZPunft/wi+brtUfk74ZEy/oOzgWb7q5IQhE8O/vZ9YQTxF2/9WqGSG7KJG2zxRFBw/yO4EvmpbVF5P22TtgdnUdfK7pfLo7I7w4iZwJszI2wNNK4XKjkOjOCVjQCfkpQNpyvvZ9r7qnodfPzZy58ZQFBYM8hGyPhPPAENsckei9nwaiU/ps29PIXAZSzlIsvSpv+ovBWVD2LQO+RxbPZVVU0kNpYy/Xtn1js1BLgUGKJu6mo1UFcxF10VN/2lM33BEPibKITX5L9hLHJjNYA11CG9jeTPhJ4y46+K2eAOWpc01QSfhMiEJITzMDHSF/rlomf3iMVMv+zJmCXIV+pRznLPLzyEEL4vSdlAWtqOz1Z2l678H53E/HhSfBuFWWUPL+iy4ZPKuRPXR/yTvz98oqP/688OMcpCivk/3VAobvZJkIL2MF6IW3yysvv0q4InGvTTu8kJKRtaLuciOxCX6DkemQ0eYlvSVYYoBNdw7Yv5Jp0bokKoTM1ig0YISFhglbf4AuZhrDHKm/658m9Dc+V3Y/AJBPeUvSwbXIVILYhZbge86lDa/DKP04iZShSibzAAEjVlyLpCTLiSmkYuPjb60mhdmlKtoQ/WNVeoVeaiAcQt5e8kLoXy7w9hWQQEcdNHjQ9XQgjAZSFY+JiJtk+RJqfMXGQF1yFV6WYwA0siy62g95HHtif+yd8blnIhMAa3XytzKKHcF2SgLJRJxF8vyFH819EJTE1QQK1BTi5gQIRgV8RyW9zwwOYrUIS8vY+/AdewLfbBvkTMN3zDleDGjf8AHb5ZjjtCjt0AAAAASUVORK5CYII=
// @match          https://www.amazon.co.uk/*dp/*
// @match          https://www.amazon.co.uk/d/*
// @match          https://www.amazon.com/*dp/*
// @match          https://www.amazon.com/d/*
// @grant          none
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370254/Amazon%20-%20Offer%20page%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/370254/Amazon%20-%20Offer%20page%20links.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, -W097, eqnull: true */
/* globals jQuery, $, DetailPage, ue_pti, ue_pty */

/**
= Changelog =

=== 1.2.0 (13.07.2018) ===
* Remove URI.js

=== 1.1.0 (04.07.2018) ===
* Include Amazon.com in matching pages
* Updated jQuery to v3 on unpkg.com
* Fixed unknown global variables

=== 1.0.1 (23.4.2017) ===
* Added `/d/` match

*/

(function($) {
  'use strict'

  const def = (value, default_value = '') => value != null ? value : default_value
  
  // --------------------------------------------------------------------

  function getASIN(parent = false) {
    try {
      const state = DetailPage.StateController.getState()
      return state && state[ parent ? 'parent_asin' : 'current_asin' ] || ue_pti
    }
    catch (ex) {
      const m = location.pathname.match(/\/([A-Z]\d{2}[A-Z0-9]{7})(?=\/|$)/)
      
      if (m && m[1]) return m[1]
    }
  }

  // --------------------------------------------------------------------

  function featureBlock(name, content) {
    if (content instanceof Node) {
      content = content.outerHTML
    }
    
    return $(`
      <div class="feature" data-feature-name="${name}">
        <div class="a-section a-spacing-medium">
          ${String(content)}
        </div>
      </div>
    `)
  }

  // --------------------------------------------------------------------
  
  const page_type = def(ue_pty, 'UNKNOWN')
  // console.info(`page_type = "${page_type}"`)
  
  if (page_type !== 'Detail') return

  const asin = getASIN()
  
  if (asin) {
    // console.info(`Amazon(asin: ${asin}, url: "/gp/offer-listing/${asin}/")`)

    featureBlock('offerList', `<span class="a-size-large"><a href="/gp/offer-listing/${asin}/">♦ See all offers for this product ♦</a></span>`)
      .insertAfter('#twister_feature_div')
  } else {
    console.warn(`No ASIN found!`)
  }

})(jQuery)

jQuery.noConflict(true)
