// ==UserScript==
// @name         DH3 VarViewer
// @namespace    com.anwinity.dh3
// @version      1.2.2
// @description  Easy way to view var_ values in DH3
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406837/DH3%20VarViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/406837/DH3%20VarViewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VarViewer = {
        init: function() {
            // overwrite navigate to handle new tab
            const oldNavigate = window.navigate;
            window.navigate = function(a,b,c,d,e,f,g,h,i,j,k,l,m) {
                oldNavigate(a,b,c,d,e,f,g,h,i,j,k,l,m);
                if(a=="right-vars") {
                    VarViewer.refresh();
                }
                else {
                    $("#navigation-right-vars").hide();
                }
            };

            // add some styling (cause we fancy)
            const styles = document.createElement("style");
            styles.textContent = `
              table#vars-table {
                border-collapse: collapse;
              }
              table#vars-table tr, table#vars-table th, table#vars-table td {
                border: 1px solid grey;
              }
              table#vars-table th, table#vars-table td {
                padding: 0.25em;
              }
            `;
            $("head").append(styles);

            // add the button
            $("#navigation-area-buttons").append(`
            <div onclick="navigate('right-vars')" id="navigation-right-vars-button" class="navigate-button" style="color: white;">
              <img src="images/fireIcon.png" class="img-50" />
              <br />
              <div style="font-size: 10pt; text-align: center;">Vars</div>
            </div>`);

            // add the content
            $("#right-panel").append(`
            <div id="navigation-right-vars" style="display: none; padding: 1em;">
              <div>
                <button id="varviewer-clear" type="button">Clear</button>&nbsp;&nbsp;
                <input id="varviewer-filter" type="text">&nbsp;&nbsp;
                <button id="varviewer-search" type="button">Search</button><br />
                <table id="vars-table" style="margin-top: 0.5em">
                  <thead>
                    <tr>
                      <th style="text-align: left">Var Name</th>
                      <th style="text-align: left">Var Value</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
            `);


            $("#varviewer-filter").keypress(function(e) {
                if(e.keyCode == 13) {
                    $("#varviewer-search").click();
                }
            });
            $("#varviewer-clear").click(function() {
                $("#varviewer-filter").val("");
                VarViewer.refresh();
            });
            $("#varviewer-search").click(function() {
                VarViewer.refresh($("#varviewer-filter").val());
            });
        },
        refresh: function(filter) {
            if(filter) {
                filter = filter.toLowerCase();
            }
            const tbody = $("#navigation-right-vars tbody");
            tbody.empty();
            tbody.append('<tr><td id="vars-table-one-sec" colspan="2">One Sec...</td></tr>');
            setTimeout(() => {
                Object.keys(window)
                    .filter(v=>v.startsWith("var_"))
                    .filter(v=>!filter || v.toLowerCase().includes(filter) || `${window[v]}`.toLowerCase().includes(filter))
                    .sort()
                    .forEach(function(v) {
                    tbody.append(`
                        <tr>
                          <td>${v}</td>
                          <td>${window[v]}</td>
                        </tr>
                    `);
                });
                $("#vars-table-one-sec").remove();
            }, 1);

        }
    };

    VarViewer.init();
})();