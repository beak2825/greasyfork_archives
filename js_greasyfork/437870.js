// ==UserScript==
// @name			★Moomoo.io Anti Invis! 2022! Non-Bundle!
// @version			1.0
// @description		Anti Invis!
// @author			xPlasmicc
// @match			*://moomoo.io/*
// @grant			none
// @namespace       https://greasyfork.org/en/users/855407-xplasmicc
// @license         none
// @downloadURL https://update.greasyfork.org/scripts/437870/%E2%98%85Moomooio%20Anti%20Invis%21%202022%21%20Non-Bundle%21.user.js
// @updateURL https://update.greasyfork.org/scripts/437870/%E2%98%85Moomooio%20Anti%20Invis%21%202022%21%20Non-Bundle%21.meta.js
// ==/UserScript==

CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate
CanvasRenderingContext2D.prototype.rotate = function(e){
    if(Math.abs(e) > 1e300){
        e = Math.atan2(Math.cos(e), Math.sin(e));
        this.globalAlpha = 0.5;
        this.rotatef(e);
    }else{
        this.rotatef(e);
    }
};