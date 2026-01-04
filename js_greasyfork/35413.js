// ==UserScript==
// @name Recreate Setup on epicmafia.com
// @namespace    https://greasyfork.org/en/users/159342-cleresd
// @description Add a recreate button to the epicmafia.com setup pages
// @version 1.05
// @match       https://epicmafia.com/setup/*
// @include     https://epicmafia.com/game/new
// @grant GM_setValue
// @grant GM_getValue
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/35413/Recreate%20Setup%20on%20epicmafiacom.user.js
// @updateURL https://update.greasyfork.org/scripts/35413/Recreate%20Setup%20on%20epicmafiacom.meta.js
// ==/UserScript==

// Примечание: Опция Multiple Mafias не работает в Main lobby

$(document).ready(function () {

    setTimeout(() => {
        getMy();
        if ($('.setup_actions').length) {
            let recreateButtonHtml = '<div class="play_menu" onclick="my.reCreateSetup()" onmouseover="this.style.borderColor=\'#b11\';this.style.backgroundColor=\'#eee\';" onmouseout="this.style.borderColor=\'#999\';this.style.backgroundColor=\'#eee\';" style="width: 65px"><div class="play_menu_text" style="color: rgb(205, 136, 211);">Recreate</div></div></div>';
            $('.setup_actions').after(recreateButtonHtml);
        }
        else if ($('#subnav').find('li.sel > a.sel').text() === 'Create game') {
            console.log(GM_getValue("myRecreateSetupFunctionText"));
            let recreateSetupFunctionText = GM_getValue("myRecreateSetupFunctionText");
            my.bodyAppendScript(my.getTextThatAddAbilityToFastRemoveRoles());
            if (recreateSetupFunctionText !== undefined && recreateSetupFunctionText !== '') {
                my.bodyAppendScript(GM_getValue("myRecreateSetupFunctionText"));
                GM_setValue("myRecreateSetupFunctionText", '');
            }
        }
    }, 1000);
});

function getMy() {
    my = {};
    my.reCreateSetup = function () {
        let getDataFromSetupObject = {
            result: '(function(){',
            gameOptionIds: [],
            roles: [],
            gameSetup: $('.gamesetup').children(),

            getDataFromFixedSetup: function () {

                for (let i = 0; i < this.gameSetup.length - 3; i++) {
                    let currEl = this.gameSetup[i];

                    if (currEl.classList.contains('false')) {
                        // get game's option
                        let optionId = '#add_' + currEl.classList[0].split('-')[0];
                        this.gameOptionIds.push(optionId);
                    } else if (currEl.firstElementChild.classList.contains('roleimg')) {
                        // get role
                        // get role's count
                        let roleName = currEl.firstElementChild.classList[1];
                        roleName += currEl.firstElementChild.classList.contains('mafia_red') ?
                            '.mafia_red' : ':not(.mafia_red)';
                        let roleCount = currEl.firstElementChild.hasChildNodes() ?
                            currEl.firstElementChild.firstElementChild.textContent : 1;
                        this.addRoles(roleName, roleCount);
                    }
                }
            },

            addRoles: function (roleName, roleCount) {
                for (let j = 0; j < roleCount; j++) {
                    this.roles.push('\'.' + roleName + '\'');
                }
            },

            getDataFromRandomSetup: function () {
                for (let i = 0; i < this.gameSetup.length - 3; i++) {
                    let currEl = this.gameSetup[i];

                    if (currEl.classList.contains('false')) {
                        // get game option
                        let optionId = '#add_' + currEl.classList[0].split('-')[0];
                        this.gameOptionIds.push(optionId);
                    } else {
                        let isMultipleMafiaTeams = this.gameOptionIds.indexOf('#add_multiple') !== -1;
                        // get roles
                        let $allRoles = $('.allroles_align').children();
                        let allRoleCount = $allRoles.length;

                        if (isMultipleMafiaTeams) {
                            let villagerRoleCount = $('#prob_village').find('div.allroles_align').children().length;
                            let mafiaRoleCount = $('#prob_mafia').find('div.allroles_align').children().length;
                            let villagerAndMafiaRoleCount = villagerRoleCount + mafiaRoleCount;
                            let firstPartOfMafiaRoleCount = Math.round(mafiaRoleCount / 2);
                            let secondPartOfMafiaRoleCount = mafiaRoleCount - firstPartOfMafiaRoleCount;
                            for (let i = 0; i < villagerRoleCount; i++) {
                                this.addRandomRole($allRoles[i]);
                            }
                            for (let i = villagerRoleCount; i < villagerRoleCount + firstPartOfMafiaRoleCount; i++) {
                                this.addRandomRoleMafia($allRoles[i], false);
                            }
                            for (let i = villagerRoleCount + firstPartOfMafiaRoleCount;
                                 i < villagerRoleCount + firstPartOfMafiaRoleCount + secondPartOfMafiaRoleCount; i++) {
                                this.addRandomRoleMafia($allRoles[i], true);
                            }
                            for (let i = villagerAndMafiaRoleCount; i < allRoleCount; i++) {
                                this.addRandomRole($allRoles[i]);
                            }
                        } else {
                            for (let i = 0; i < allRoleCount; i++) {
                                this.addRandomRole($allRoles[i]);
                            }
                        }
                    }
                }
            },

            addRandomRole: function (randomRole) {
                let roleName = randomRole.classList[1];
                roleName += randomRole.classList.contains('mafia_red') ?
                    '.mafia_red' : ':not(.mafia_red)';
                this.roles.push('\'.' + roleName + '\'');
            },

            addRandomRoleMafia: function (randomRole, redTeam) {
                let roleName = randomRole.classList[1];
                roleName += redTeam ?
                    '.mafia_red' : ':not(.mafia_red)';
                this.roles.push('\'.' + roleName + '\'');
            },

            getOptionsBeforeRoles: function () {
                let addBeforeRoles = '';
                // closed roles on the top to add all roles in correct way
                let closedRolesOptionIndex;
                if ((closedRolesOptionIndex = this.gameOptionIds.indexOf('#add_closedroles')) !== -1) {
                    // if exist
                    this.gameOptionIds.splice(closedRolesOptionIndex, 1);
                    addBeforeRoles += '\n$(\'#add_closedroles\').click();\n';
                }
                return addBeforeRoles;
            },

            getOptionsAfterRoles: function () {
                let addAfterRoles = '';
                // make sure it would be all right with whisper game option
                let whisperOptionIndex;
                if ((whisperOptionIndex = this.gameOptionIds.indexOf('#add_whisper')) !== -1) {
                    // if exist
                    this.gameOptionIds.splice(whisperOptionIndex, 1);
                } else {
                    // if doesn't exist
                    this.gameOptionIds.push('#add_whisper');
                }

                // add all game options to the result line
                for (let i = 0; i < this.gameOptionIds.length; i++) {
                    let optionId = this.gameOptionIds[i];
                    addAfterRoles += '$(\'' + optionId + '\').click();\n';
                }

                if ($('#prob_village').find('> div > .uniquealign').length === 1) {
                    addAfterRoles += '$(\'#add_unique_village\').click();\n';
                }
                if ($('#prob_mafia').find('> div > .uniquealign').length === 1) {
                    addAfterRoles += '$(\'#add_unique_mafia\').click();\n';
                }
                if ($('#prob_third').find('> div > .uniquealign').length === 1) {
                    addAfterRoles += '$(\'#add_unique_third\').click();\n';
                }

                return addAfterRoles;
            },

            getFinalResult: function (addBeforeRoles, addAfterRoles) {
                this.result += '\nlet roles = [' + this.roles + '];\n';

                this.result += `
let checkExist = setInterval(function() {
  if ($(roles[0]).length) {
    clearInterval(checkExist);\n` + addBeforeRoles + `
    for (let i = 0; i < roles.length; i++) {
      $(roles[i]).prev().children('.inc').click();
    }\n` + addAfterRoles + `
  }
}, 500);\n`;
            },

            getFinalResultFromMultisetup: function (addBeforeRoles, addAfterRoles) {
                let roleCountInOneSetup = Number($('.rolecont > .roleimg.role-unknown > .sup').text());
                let setupCount = this.roles.length / roleCountInOneSetup;

                function addEmptySetups() {
                    let result = '';
                    for (let i = 0; i < setupCount - 1; i++) {
                        result += "$('#addgroup').click();\n";
                    }
                    return result;
                }

                this.result += '\nlet roles = [' + this.roles + '];\n';

                this.result += `
function addSetups(currentSetup) {
    let result = '';
    let startId = currentSetup * roleCountInOneSetup;
    let endId = startId + roleCountInOneSetup;
    for (let i = startId; i < endId; i++) {
        $(roles[i]).prev().children('.inc').click();
    }
    return result;
}

let roleCountInOneSetup = ` + roleCountInOneSetup + `;
let setupCount = ` + setupCount + `;
let currentSetup = 0;
let checkExist = setInterval(function() {
  if ($(roles[0]).length) {
    clearInterval(checkExist);\n` +
                    addBeforeRoles +
                    addEmptySetups() + `
    for (let i = 0; i < setupCount; i++){
        $('#gameicons').children().eq(i).click();
        addSetups(i);
    }\n` +
                    addAfterRoles +
                    ` }
}, 500);\n`;
            },

            getResult: function () {
                if ($('.gamesetup > .probabilities').length === 1) {
                    this.getDataFromRandomSetup();
                } else {
                    this.getDataFromFixedSetup();
                }

                let addBeforeRoles = this.getOptionsBeforeRoles();
                let addAfterRoles = this.getOptionsAfterRoles();

                // add all roles to the result line
                if (this.gameSetup.parent().find('li.selsetup').length === 1) {
                    this.getFinalResultFromMultisetup(addBeforeRoles, addAfterRoles);
                } else {
                    this.getFinalResult(addBeforeRoles, addAfterRoles);
                }

                this.result += '\n})();';
            }
        };

        getDataFromSetupObject.getResult();
        console.log(getDataFromSetupObject.result);
        GM_setValue("myRecreateSetupFunctionText", getDataFromSetupObject.result);
        window.open('https://epicmafia.com/game/new', '_blank');
    };
    my.bodyAppendScript = function (scriptText) {
        $(document.body).append('<script type="text/javascript">' + scriptText + '</script>');
    };
    my.getTextThatAddAbilityToFastRemoveRoles = function () {
        return `
function removeRole(e) {
    let isRowSelected = e.target.parentElement.parentElement.classList.contains('sel');
    let roleName = e.target.classList[1];
    let redMafia = e.target.classList[2] !== undefined ? '.mafia_red' : ':not(.mafia_red)';
    let actionString = '.dec';
    doActionWithRole(isRowSelected, roleName, redMafia, actionString);
}
function addRole(e) {
    let isRowSelected = e.target.parentElement.parentElement.classList.contains('sel');
    let roleName = e.target.classList[1];
    let redMafia = e.target.classList[2] !== undefined ? '.mafia_red' : ':not(.mafia_red)';
    let actionString = '.inc';
    doActionWithRole(isRowSelected, roleName, redMafia, actionString);
}
function doActionWithRole(isRowSelected, roleName, redMafia, actionString) {
    if (isRowSelected) {
        $('div.' + roleName + redMafia).prev().children(actionString).click();
    }
}
var observerThatAddAbilityToRemoveAddedRoles = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length && mutation.addedNodes[0].classList.contains('roleimg')) {
            $(mutation.addedNodes[0]).click((e) => {
                if (e.ctrlKey) addRole(e);
                else removeRole(e);
            })
        }
    });
});
var observerAddingNewSetups = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
            $(mutation.addedNodes[0]).children().children('.roleimg').click((e) => {
                if (e.ctrlKey) addRole(e);
                else removeRole(e);
            });
            observerThatAddAbilityToRemoveAddedRoles.observe(mutation.addedNodes[0], { childList: true, subtree: true });
        }
    });
});
observerThatAddAbilityToRemoveAddedRoles.observe($('#gameicons > div.createsetup.sel')[0], { childList: true, subtree: true });
observerAddingNewSetups.observe($('#gameicons')[0], { childList: true});`
    };
}
