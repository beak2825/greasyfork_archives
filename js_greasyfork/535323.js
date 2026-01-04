// ==UserScript==
// @name         SYSWISE - ABAP Task List - Hide garbage fields
// @namespace    http://office.syswise.com/
// @version      0.1
// @description  SYSWISE - ABAP Task List - Userscript for Hide garbage fields
// @author       joaquim.perez@syswise.com
// @match        https://app.smartsheet.com/sheets/gxhVgc2x4q7x6gJ2PpvjHfCvjv2J5p9QCVjFHgF1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syswise.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535323/SYSWISE%20-%20ABAP%20Task%20List%20-%20Hide%20garbage%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/535323/SYSWISE%20-%20ABAP%20Task%20List%20-%20Hide%20garbage%20fields.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oCore = {
        run: function()
        {
            this._adaptTaskDetailDialog();
        },

        _adaptTaskDetailDialog: function()
        {
            const oObserver = new MutationObserver(this._onTaskDetailDialogOpen.bind(this));
            const oHome = document.querySelector(".clsDesktopHome");

            oObserver.observe(oHome, { childList: true });
        },

        _onTaskDetailDialogOpen: function(oMutations)
        {
            const oAllowedFields = [
                "Issue Key",
                "ID Change/Incident",
                "Customer",
                "Project",
                "Task Name",
                "Status",
                "Request type",
                "Priority",
                "ABAP that previously worked on this",
                "Assigned To",
                "System ID",
                "Incident Number",
                "Estimated effort (days)",
                "Requested delivery date",
                "Submitted By",
                "Comment",
                "Created",
                "Created By",
                "Last Update",
                "Modified By",
                "ShareWise URL"
            ];

            const bIsDialogAdded = oMutations.find(function(oMutation)
                                                   {
                const oAddedNodes = Array.from(oMutation.addedNodes);
                const bIsDialogAdded = oAddedNodes.find(function(oNode)
                                                        {
                    return oNode.className.includes("clsFormContainer");
                });

                return bIsDialogAdded;
            });

            if(bIsDialogAdded)
            {
                const oDialogFields = Array.from(document.querySelectorAll(".clsFieldEditor"));
                oDialogFields.forEach(function(oField)
                                      {
                    const bIsAllowed = (oAllowedFields.includes(oField.firstChild.innerText));
                    if(bIsAllowed)
                    {
                        // ok
                    }
                    else
                    {
                        // should hide
                        oField.style.display = "none";
                    }
                });
            }
        }
    };

    oCore.run();

})();