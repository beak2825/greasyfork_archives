// ==UserScript==
// @name         Troubleshooting Tool Events
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pokazuje ostatnie 2 lokacje dla wielu paczek (więcej niż 50)
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/sortcenter/tantei*
// @match        https://trans-logistics-eu.amazon.com/sortcenter/tt?setNodeId=KTW1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490016/Troubleshooting%20Tool%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/490016/Troubleshooting%20Tool%20Events.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var token = '';
    var paczki = [];


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addBetterBulkButton() {

        if(!document.getElementById('better_bulk_id') && document.querySelector('.css-y9yg3a'))
        {
            token = getTokenValue();

            const targetButton = document.querySelector('.css-15jtioc').querySelector('.css-y9yg3a');

            const button = document.createElement('button');
            button.id = 'better_bulk_id';
            button.className = 'css-c6ayu0';
            button.textContent = 'Check Last 2 Events';
            button.addEventListener('click', async function() {
                const paczki = document.querySelector('textarea').value.split('\n');
                const labelCount = document.getElementById('label_count');

                labelCount.innerText = paczki.length;

                for (let z = 0; z < paczki.length; z++) {
                    var ile = document.getElementById('textarea_resp_id').innerText.split('\n').length;
                    labelCount.innerText = ile + ' / ' + paczki.length;
                    await findLastAuditEvent(paczki[z]);
                    await delay(333);
                }
            });

            const label_count = document.createElement('p');
            label_count.id = 'label_count';
            label_count.className = 'css-f4cjug';
            label_count.style = 'display:inline;margin-left:2%;';

            const opcje = document.createElement('div');
            opcje.id = 'opcje_id';
            opcje.style = 'display:inline;margin-left:5%;';

            const bad_only_option = document.createElement('input');
            bad_only_option.type = 'checkbox';
            bad_only_option.style.display = 'inline';
            bad_only_option.id = 'bad_only_option';

            const bad_only_label = document.createElement('p');
            bad_only_label.id = 'bad_only_label';
            bad_only_label.style.display = 'contents';
            bad_only_label.textContent = 'Show only not departed';

            opcje.appendChild(bad_only_option);
            opcje.appendChild(bad_only_label);


            const textarea_resp = document.createElement('div');
            textarea_resp.id = 'textarea_resp_id';
            textarea_resp.style = 'display:block;margin-top:10px;width:100%;height:200px;overflow-y:auto;';


            document.querySelector('.css-1luzmk9').style.width = '1200px';


            targetButton.parentNode.appendChild(button);
            targetButton.parentNode.appendChild(label_count);
            targetButton.parentNode.appendChild(opcje);
            targetButton.parentNode.appendChild(textarea_resp);
        }
    }



    function getTokenValue() {
        var tokenInput = document.querySelector('input[type="hidden"][name="__token_"]');
        return tokenInput ? tokenInput.value : null;
    }

    async function postJsonAndGetContents(search_id) {
        try {
            const response = await fetch('https://trans-logistics-eu.amazon.com/sortcenter/tantei/graphql', {
                method: 'POST',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "anti-csrftoken-a2z": token,
                    "content-type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                body: JSON.stringify("{\"query\":\"\\nquery ($queryInput: [SearchTermInput!]!) {\\n  searchEntities(searchTerms: $queryInput) {\\n    searchTerm {\\n      nodeId\\n      nodeTimezone\\n      searchId\\n      searchIdType\\n      resolvedIdType\\n    }\\n    events {\\n      identifier\\n      description {\\n        ... on AuditAttemptEventDescription {\\n          auditStatus\\n          userProvidedValue\\n          actualValue\\n        }\\n        ... on ContainerMoveFailureEventDescription {\\n          failureReason\\n          attemptLocationId\\n          attemptLocationLabel\\n          attemptDestinationId\\n          attemptDestinationLabel\\n        }\\n        ... on ContainerAssociationEventDescription {\\n          associationReason\\n          childContainerId\\n          childContainerLabel\\n          parentContainerId\\n          parentContainerLabel\\n          parentContainerType\\n        }\\n        ... on ContainerAuditEventDescription {\\n          stateChangeReason\\n          currentStateId\\n          currentStateScannables\\n          currentStateParentId\\n          currentStateParentLabel\\n          previousStateHasDeparted\\n          previousStateLocationId\\n          previousStateLocationLabel\\n          previousStateParentId\\n          previousStateParentLabel\\n        }\\n        ... on LoadPlanUpdateEventDescription {\\n          currentAssociatedTrailerId\\n          currentLoadState\\n          currentOperationType\\n          previousAssociatedTrailerId\\n          previousLoadState\\n        }\\n        ... on AmphoraEventDescription {\\n          cloudAuthId\\n          actionType\\n          epochMilli\\n          naturalKeys\\n          relation\\n          relations {\\n            key\\n            value\\n          }\\n          target\\n          targets\\n          openContent\\n          patch\\n          definitionId\\n          workRequest\\n          workRequestInfo\\n          workState\\n          workStateInfo\\n          assemblyType\\n          workCreateUpdate\\n        }\\n      }\\n      byUser\\n      byModule\\n      lastUpdateTime\\n    }\\n  }\\n}\\n\",\"variables\":{\"queryInput\":[{\"nodeId\":\"KTW1\",\"searchId\":\"" + search_id + "\",\"searchIdType\":\"UNKNOWN\"}]}}")
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd przy żądaniu POST:', error);
            return [];
        }
    }


    async function findLastAuditEvent(search_id) {
        try {
            const response = await postJsonAndGetContents(search_id.trim());
            const events = response.data.searchEntities[0].events;

            let lastEntry = null;
            let prevlastEntry = null;

            for (let i = events.length - 1; i >= 0; i--) {
                const entry = events[i];

                if (entry.identifier === "TANTEI_CONTAINER_AUDIT_EVENT_IDENTIFIER") {
                    if(entry.description.stateChangeReason != "CPI_AUTO_INJECTION")
                    {
                        prevlastEntry = events[i-1];
                        lastEntry = entry;
                        break;
                    }
                    else
                    {
                        const url = "https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=";
                        const link = `<a href="${url+search_id}" target="_blank">${search_id}</a>`;
                        document.getElementById('textarea_resp_id').innerHTML += link + ' - Brak historii<br>';
                    }
                }
            }

            if (lastEntry) {

                const url = "https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=";
                const link = `<a href="${url+search_id}" target="_blank">${search_id}</a>`;

                const link_current_prev = `<a href="${url+prevlastEntry.description.currentStateParentLabel}" target="_blank">${prevlastEntry.description.currentStateParentLabel}</a>`;
                let link_current_last = ``;


                if(lastEntry.description.currentStateParentLabel == null)
                {
                    link_current_last = ``;
                }
                else
                {
                    link_current_last = ` in <a href="${url+lastEntry.description.currentStateParentLabel}" target="_blank">${lastEntry.description.currentStateParentLabel}</a>`;
                }



                const url_byUser = "https://fclm-portal.amazon.com/employee/timeDetails?warehouseId=KTW1&employeeId=";
                const link_byUser_prev = `<a href="${url_byUser+prevlastEntry.byUser}" target="_blank">${prevlastEntry.byUser}</a>`;
                let link_byUser_last = ``;

                if(lastEntry.byUser == null)
                {
                    link_byUser_last = ``;
                }
                else
                {
                    link_byUser_last = ` by <a href="${url_byUser+lastEntry.byUser}" target="_blank">${lastEntry.byUser}</a>`;
                }





                if(document.getElementById('bad_only_option').checked == true)
                {
                    if(!lastEntry.description.stateChangeReason.includes('DEPART'))
                    {
                        document.getElementById('textarea_resp_id').innerHTML += link + ' - ' + prevlastEntry.description.stateChangeReason + ' by ' + link_byUser_prev + ' in ' + link_current_prev + ' => ' + lastEntry.description.stateChangeReason +
                            link_byUser_last + link_current_last + '<br>';
                    }
                }
                else
                {
                    document.getElementById('textarea_resp_id').innerHTML += link + ' - ' + prevlastEntry.description.stateChangeReason + ' by ' + link_byUser_prev + ' in ' + link_current_prev + ' => ' + lastEntry.description.stateChangeReason +
                        link_byUser_last + link_current_last + '<br>';
                }

            } else {
                console.log("Brak wpisów z identyfikatorem 'TANTEI_CONTAINER_AUDIT_EVENT_IDENTIFIER' dla tego elementu.");
            }
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                addBetterBulkButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();