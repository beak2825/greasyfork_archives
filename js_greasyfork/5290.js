// ==UserScript==
// @name        The West Animation entfernen
// @namespace   *
// @include     http://*.the-west.*/game.php*
// @description  The West Animation beim Oktoberfest entfernen
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/5290/The%20West%20Animation%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/5290/The%20West%20Animation%20entfernen.meta.js
// ==/UserScript==

west.wof.WofOctoberWindow.prototype.doBuild = function() {
        var data = {
            payid: this.buildPayHandler.getSelectedPayId(),
            enhance: this.buildPayHandler.getSelectedEnhance()
        };
        this.wof.process("build", data, function(resp) {
            Character.setNuggets(parseInt(resp.nuggets));
            //GambleWindow.init(resp, this);
            this.constructions[resp.construction_id].setBuildTime(resp.finish_date).setFailed(resp.failed);
            if (resp.stage != undefined) this.constructions[resp.construction_id].setBuildingStage(resp.building_stage);
            this.btnHalve.enable();
            this.wof.mode.summaryStage = resp.summaryStage;
            this.wof.mode.ranking = resp.ranking;
            this.updateSummary();
            this.updateRanking();
        }.bind(this), this.window_);
    };