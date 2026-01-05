// ==UserScript==
// @name         AnimesVision.com
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.4
// @description  Remove o tempo de espera do Download "Link Direto" do site AnimesVision.com
// @author       Felippe Renan Albano
// @include      http*://*visionshare.net.br/*
// @include      http*://*share.aliancavision.com.br/*
// @include      http://visioncloud.info/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/16754/AnimesVisioncom.user.js
// @updateURL https://update.greasyfork.org/scripts/16754/AnimesVisioncom.meta.js
// ==/UserScript==

unsafeWindow.tempo = 0;