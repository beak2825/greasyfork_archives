// ==UserScript==
// @name         Salesforce Workbench SOQL Query Screen Maximiser
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  Increases the size of the field selector box
// @author       Wilsoff
// @match        https://workbench.developerforce.com/query.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=developerforce.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492027/Salesforce%20Workbench%20SOQL%20Query%20Screen%20Maximiser.user.js
// @updateURL https://update.greasyfork.org/scripts/492027/Salesforce%20Workbench%20SOQL%20Query%20Screen%20Maximiser.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function _formatPage() {

        document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

        const main = document.getElementById('mainBlock');
        const objSel = document.getElementById('QB_object_sel');
        const fieldSel = document.getElementById('QB_field_sel');
        const options1 = document.querySelector("#query_form > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
        const options2 = document.getElementById('QB_right_sub_table');
        const tableDatas = document.getElementsByTagName('td');
        const soql = document.getElementById('soql_query_textarea');
        const info = document.getElementsByClassName('displayInfo');
        const mig = document.getElementsByClassName('migrationInfo');
        var i = 0;

        if (window.innerWidth >= 1000) {

            //Make whole page 100% width
            main.style.setProperty('width', '100%', 'important');

            //Format the object selector
            objSel.style.width = '32em';
            objSel.style.maxWidth = 'calc(100vw - 22px - var(--scrollbar-width))';

            //Make the field selector bigger
            fieldSel.size = 25;
            fieldSel.style.width = '32em';
            fieldSel.style.maxWidth = 'calc(100vw - 22px - var(--scrollbar-width))';

            //Make the elements on the right align to the left
            options1.style.setProperty('display', 'flex', 'important');
            options2.style.setProperty('display', 'flex', 'important');

            //Add spacing to make it look more like the original:
            for(i=0;i<tableDatas.length;i++){
                if(tableDatas[i].innerHTML.startsWith("Deleted and archived records")) {
                    tableDatas[i].style.setProperty('margin-left', '50px', 'important');
                    break;
                }
            }

            for(i=0;i<tableDatas.length;i++){
                if(tableDatas[i].innerHTML.startsWith("<br>Max Records")) {
                    tableDatas[i].style.setProperty('padding-left', '50px', 'important');
                    break;
                }
            }

            //Format Max Records
            document.getElementById('QB_limit_txt').style.setProperty('margin-left', '50px', 'important');

            //Increase size of SOQL query box
            soql.rows = 12;
            soql.style.width = '100%';
            soql.style.maxWidth = 'calc(100vw - 28px - var(--scrollbar-width))';

            //Hide the info box
            if (info.length == 1) {
                info[0].style.display = 'none';
            }

            //Hide the red bar
            if (mig.length == 1) {
                mig[0].style.display = 'none';
            }

        } else {
            //Make whole page 750px width again
            main.style.setProperty('width', '750px', 'important');

            //Reset the object selector
            objSel.style.width = '16em';
            objSel.style.maxWidth = 'unset';

            //Reset the field selector bigger
            fieldSel.size = 6;
            fieldSel.style.width = '16em';
            fieldSel.style.maxWidth = 'unset';

            //Reset the elements on the right align to the left
            options1.style.display = 'revert';
            options2.style.display = 'revert';

            //Reset spacing:
            for(i=0;i<tableDatas.length;i++){
                if(tableDatas[i].innerHTML.startsWith("Deleted and archived records")) {
                    tableDatas[i].style.marginLeft = 'unset';
                    break;
                }
            }

            for(i=0;i<tableDatas.length;i++){
                if(tableDatas[i].innerHTML.startsWith("<br>Max Records")) {
                    tableDatas[i].style.paddingLeft = 'unset';
                    break;
                }
            }

            //Reset the Max Records box
            document.getElementById('QB_limit_txt').style.marginLeft = 'unset';

            //Reset the SOQL query box
            soql.rows = 5;
            soql.style.width = '99%';
            soql.style.maxWidth = 'unset';

            //Reset the Info box
            if (info.length == 1) {
                info[0].style.display = 'revert';
            }

            //Reset the red bar
            if (mig.length == 1) {
                mig[0].style.display = 'revert';
            }
        }
    }

    // recalculate on resize
    window.addEventListener('resize', _formatPage, false);

    // recalculate on dom load
    document.addEventListener('DOMContentLoaded', _formatPage, false);

    // recalculate on load (assets loaded as well)
    window.addEventListener('load', _formatPage);

})();