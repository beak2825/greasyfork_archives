// ==UserScript==
// @name         Neuvopack Overhaul
// @namespace    https://greasyfork.org/en/scripts/468141-neuvopack-overhaul
// @version      1.0.1
// @description  Améliorations des neuvopacks de DC
// @author       Eldrik, Altaïr
// @match        https://www.dreadcast.net/Main
// @icon         https://www.dreadcast.net/images/objets/mini/NEUVOPACK_262px.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468141/Neuvopack%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/468141/Neuvopack%20Overhaul.meta.js
// ==/UserScript==

/* globals $, Engine */

let hasOneNeuvoActive = false;
let initialTime = 0;
let time = 0;
let activeNeuvopackId;
let actionActuelleObserver;
let annexeInventaireObserver;
let zoneConteneurObserver;

// Choisir 'monochrome' pour une ligne plus mince noir et blance et 'tricolore' pour la barre plus large avec les trois couleurs.
const progressBarStyle = 'monochrome';

const getNeuvopackElement = (id, fillLevel, durability, maxDurability) => {
    const element = $(`
    <div id="neuvopack_${id}" class="conteneur ui-draggable ui-draggable-handle" style="left: 100px; top: 100px; position: absolute;">
      <div class="titreConteneur couleur0" title="Neuvopack">Neuvopack ${id}</div>
      <div class="conteneur_content" style="background: url(../../../../images/fr/design/fond_interface_3_chat.png) 0 0 no-repeat;background-size: cover;">
        <div style="width: 240px; height: 100px; display: flex; flex-direction: column;">
          <div style="height: 60%; display: flex;">
            <div id="no_neuvopack_${id}_info" style="width: 60%;">
                ${getNeuvoInfo(id, fillLevel, durability, maxDurability)}
            </div>
            <div style="width: 40%; display:flex; justify-content: center;">
                ${getTimerElement(id)}
            </div>
          </div>
          <div class="no_bottom_section">
            ${getProgressBarElement(id, fillLevel)}
            <div class="btnTxt no_eject disabled">Éjecter</div>
          </div>
        </div>
      </div>
    </div>
    `);
    element.draggable();

    if (fillLevel === '2000') {
        activateEjectButton(element.find('.no_eject'));
    }

    return element;
};

const getProgressBarElement = (id, fillLevel) => {
    if (progressBarStyle === 'monochrome') {
        const progress = (fillLevel / 2000) * 100;
        return `
<div>
    <div>
        <tt class="no_white no_small_text no_monochrome_fill_bar">
            <p id="neuvopack_${id}_fill_level">${fillLevel}</p>
            <span class="couleur5">/2000</span>
        </tt>
        <svg width="150px" viewBox="0 0 110 6">
            <line class="no_bar no_outer_bar" x1="5" x2="105" y1="3" y2="3"></line>
            <line id="neuvopack_${id}_fill_bar" class="no_bar no_inner_bar" x1="5" x2="${5 + progress}" y1="3" y2="3"></line>
        </svg>
        <div></div>
    </div>
</div>
`;
    }

    const fillColor = getFillLevelColor(fillLevel);

    return `
<div class="no_progress">
    <p id="neuvopack_${id}_fill_level" class="no_fill_level">
        ${fillLevel}
    </p>
    <div id="neuvopack_${id}_fill_bar" class="no_bar" style="width: ${fillLevel / 20.2}%;background: linear-gradient(${fillColor});"></div>
</div>`;
};

const getNeuvoInfo = (id, fillLevel, durability, maxDurability) => `
  <div class="no_neuvo_info_item">
    Appareil
    ${getNeuvoStatus(id, fillLevel)}
  </div>
  <div class="no_neuvo_info_item">
    État
    ${getNeuvoDurability(id, durability)}<span id="no_neuvopack_${id}_durability_max" class="couleur5">${maxDurability.startsWith('/') ? maxDurability : '/' + maxDurability}</span>
  </div>
`;

const eject = (element) => {
    deactivateEjectButton(element);

    const id = element.parent().parent().parent().parent().attr('id').split('_')[1];
    $.ajax({
        type: 'POST',
        url: 'https://www.dreadcast.net/Item/Activate',
        data: { id },
        success: () => emptyNeuvopack(id),
    });
};

const emptyNeuvopack = (id) => {
    $.ajax({
        type: 'POST',
        url: 'https://www.dreadcast.net/Item/Activate',
        data: { id },
        success: (res) => {
            Engine.prototype.useAjaxReturn(res);

            const durability = $(res).find('.durabiliteinfo').children('.item_pv').text();

            if (durability === '') {
                $(`#neuvopack_${id}`).remove();
                const caseId = $(res).find('.case_objet_vide_type_Extended').attr('id');
                $(caseId).removeClass('active');
            } else {
                setFillLevel(id, 0);
                setDurability(id, durability);
                recalculateAllStatuses();
                $.ajax({
                    type: 'POST',
                    url: 'https://www.dreadcast.net/Item/Activate',
                    data: { id },
                    success: (res) => Engine.prototype.useAjaxReturn(res),
                });
            }
        },
    });
};

const activateEjectButton = (element) => {
    element.click((e) => eject($(e.currentTarget)));
    element.removeClass('disabled');
};

const deactivateEjectButton = (element) => {
    element.unbind('click');
    element.addClass('disabled');
};

const recalculateAllStatuses = () => {
    hasOneNeuvoActive = false;
    $(`#no_neuvopack_${activeNeuvopackId}_timer_text`).empty().append(getDefaultFormattedTime());
    $(`#no_neuvopack_${activeNeuvopackId}_timer_inner_circle`).attr('stroke-dasharray', `0 100`);
    const neuvopacks = $('.objet_type_Neuvopack.ui-draggable').parent();

    neuvopacks.map((k, v) => {
        const isActive = $(v).hasClass('active');
        if (isActive) {
            const id = v.firstElementChild.id.split('_')[2];
            const fillLevel = $(`#neuvopack_${id}_fill_level`).text();
            const durability = $(`#no_neuvopack_${id}_durability`).text();
            const maxDurability = $(`#no_neuvopack_${id}_durability_max`).text();

            $(`#no_neuvopack_${id}_info`).children().remove();
            $(getNeuvoInfo(id, fillLevel, durability, maxDurability)).appendTo($(`#no_neuvopack_${id}_info`));
        }
    });

    if (initialTime !== 0) {
        const remainingProgress = (time / initialTime) * 100;
        $(`#no_neuvopack_${activeNeuvopackId}_timer_text`).empty().append(getFormattedTime());
        $(`#no_neuvopack_${activeNeuvopackId}_timer_inner_circle`).attr('stroke-dasharray', `${100 - remainingProgress} ${remainingProgress}`);
    }
};

const getNeuvoStatus = (id, fillLevel) => {
    if (fillLevel === '2000') {
        return '<span style="color: red;">plein</span>';
    }
    if (hasOneNeuvoActive) {
        return '<span class="couleur4">en attente</span>';
    }

    const status = '<span class="couleur1">activé</span>';
    activeNeuvopackId = id;
    hasOneNeuvoActive = true;
    return status;
};

const getNeuvoDurability = (id, durability) => {
    if (parseInt(durability) <= 4) {
        return `<span id="no_neuvopack_${id}_durability" style="color: red;">${durability}</span>`;
    }
    if (parseInt(durability) <= 10) {
        return `<span id="no_neuvopack_${id}_durability" class="couleur4">${durability}</span>`;
    }
    return `<span id="no_neuvopack_${id}_durability" class="couleur1">${durability}</span>`;
};

// https://codepen.io/scoder91/pen/PLEebV
const getTimerElement = (id) => `
  <svg viewBox="0 0 42 42" class="no_auto_margin" width="55px" height="55px">
    <circle id="c1" class="no_bar no_outer_bar" cx="21" cy="21" r="15.91549430918954" stroke-dasharray="100 0" stroke-dashoffset="100"></circle>
    <circle id="no_neuvopack_${id}_timer_inner_circle" class="no_bar no_inner_bar" cx="21" cy="21" r="15.91549430918954" stroke-dasharray="0 100" stroke-dashoffset="25"></circle>
  </svg>
  <p id="no_neuvopack_${id}_timer_text" class="no_centered no_white no_small_text">${getDefaultFormattedTime()}</p>
`;

const getFillLevelColor = (fillLevel) => {
    if (fillLevel < 1500) {
        return '#5e0, #3c0, #5e0';
    } else if (fillLevel < 1900) {
        return '#ec4, #b91, #ec4';
    }

    return '#f77, #c44, #f77';
};

const intercept = (urlMatch, callback) => {
    let send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener(
            'readystatechange',
            function () {
                if (this.responseURL.includes(urlMatch) && this.readyState === 4) {
                    callback(this);
                }
            },
            false
        );
        send.apply(this, arguments);
    };
};

const updateNeuvopack = (xmlInfo) => {
    const neuvopacks = $(xmlInfo).find('.objet_type_Neuvopack.activable').parent();

    neuvopacks.map((_, v) => {
        const id = v.firstElementChild.id.split('_')[2];
        const fillLevel = $(v).children('.infoBox').children('.infoBox_content').children('.info_objet').children('.typeinfo').children('[class^=contenance_appareil]').text();
        setFillLevel(id, fillLevel);
        if (fillLevel === '2000') {
            recalculateAllStatuses();
            activateEjectButton($(`#neuvopack_${id}`).find('.no_eject'));
        }
    });
};

const setFillLevel = (id, fillLevel) => {
    $(`#neuvopack_${id}_fill_level`).text(fillLevel);
    if (progressBarStyle === 'monochrome') {
        const progress = (fillLevel / 2000) * 100;
        $(`#neuvopack_${id}_fill_bar`).attr('x2', `${5 + progress}`);
    } else {
        const fillColor = getFillLevelColor(fillLevel);
        $(`#neuvopack_${id}_fill_bar`).css('width', `${fillLevel / 20.2}%`);
        $(`#neuvopack_${id}_fill_bar`).css('background', `linear-gradient(${fillColor})`);
    }
};

const setDurability = (id, durability) => {
    $(`#no_neuvopack_${id}_durability`).text(durability);
};

const updateResearchTimer = () => {
    const action = $('#action_actuelle').find('.action').text();
    const precision = $('#action_actuelle')?.find('.precision')?.text();

    if (action === 'Vous êtes en train de fouiller la zone' && precision !== 'Cristaux trouvés !') {
        const components = precision.replace('Prochain résultat dans ', '').replace('min', '').replace('sec', '').split(' ');
        time = parseInt(components[0]) * 60 + parseInt(components[1]);
        if (time > initialTime) {
            initialTime = time;
        }
        const remainingProgress = (time / initialTime) * 100;
        $(`#no_neuvopack_${activeNeuvopackId}_timer_text`).empty().append(getFormattedTime());
        $(`#no_neuvopack_${activeNeuvopackId}_timer_inner_circle`).attr('stroke-dasharray', `${100 - remainingProgress} ${remainingProgress}`);
    } else {
        resetTimer();
    }
};

const getFormattedTime = () => {
    const minutes = ('0' + Math.floor(time / 60)).slice(-2);
    const seconds = ('0' + Math.floor(time % 60)).slice(-2);
    return `
        <tt>${minutes}<span class="couleur5">m</span><br/>${seconds}<span class="couleur5">s</span></tt>
    `;
};

const getDefaultFormattedTime = () => '<tt>--<span class="couleur5">m</span><br/>--<span class="couleur5">s</span></tt>';

const setActionsOnNeuvopacks = (neuvopacks) => {
    neuvopacks.click((e) => {
        const id = e.currentTarget.firstElementChild.id.split('_')[2];
        const isActive = $(e.currentTarget).hasClass('active');
        const isFull =
            $(e.currentTarget).children('.infoBox').children('.infoBox_content').children('.info_objet').children('.typeinfo').children('[class^=contenance_appareil]').text() ===
            '2000';
        if (isActive && !isFull) {
            const isAlreadyCreated = $(`#neuvopack_${id}`).length > 0;
            if (!isAlreadyCreated) {
                createNeuvopackElement(e.currentTarget);
                recalculateAllStatuses();
            }
        } else {
            const neuvoElement = $(`#neuvopack_${id}`);
            if (neuvoElement.length > 0) {
                neuvoElement.remove();
                recalculateAllStatuses();
            }
        }
    });
};

const createNeuvopackElement = (neuvopack) => {
    const id = neuvopack.firstElementChild.id.split('_')[2];
    const isAlreadyCreated = $(`#neuvopack_${id}`).length > 0;

    if (!isAlreadyCreated) {
        const fillLevel = $(neuvopack)
            .children('.infoBox')
            .children('.infoBox_content')
            .children('.info_objet')
            .children('.typeinfo')
            .children('[class^=contenance_appareil]')
            .text();
        const durability = $(neuvopack).children('.infoBox').children('.infoBox_content').children('.info_objet').children('.durabiliteinfo ').children('.item_pv').text();
        const maxDurability = $(neuvopack).children('.infoBox').children('.infoBox_content').children('.info_objet').children('.durabiliteinfo ').children('.item_pv_max').text();

        getNeuvopackElement(id, fillLevel, durability, maxDurability).appendTo($('#zone_neuvopack_displayed'));
        recalculateAllStatuses();
    }
};

const resetTimer = () => {
    $(`#no_neuvopack_${activeNeuvopackId}_timer_text`).empty().append(getDefaultFormattedTime());
    $(`#no_neuvopack_${activeNeuvopackId}_timer_inner_circle`).attr('stroke-dasharray', `0 100`);
    initialTime = 0;
    time = 0;
};

const findAndCreateNeuvopacks = () => {
    const neuvopacks = $('.objet_type_Neuvopack.ui-draggable').parent();

    neuvopacks.map((_, v) => {
        const isActive = $(v).hasClass('active');
        if (isActive) {
            createNeuvopackElement(v);
        }
    });

    setActionsOnNeuvopacks(neuvopacks);
};

const recalculateStatusesOnItemMove = () => {
    $('#zone_conteneurs_displayed').ajaxComplete(() => {
        $('#zone_conteneurs_displayed').unbind('ajaxComplete');
        $('#annexe_inventaire_ext').unbind('ajaxComplete');
        recalculateAllStatuses();
    });
    $('#annexe_inventaire_ext').ajaxComplete(() => {
        $('#zone_conteneurs_displayed').unbind('ajaxComplete');
        $('#annexe_inventaire_ext').unbind('ajaxComplete');
        recalculateAllStatuses();
    });
};

$(document).ready(() => {
    setTimeout(() => {
        $('<div id="zone_neuvopack_displayed" class="zone_conteneurs_displayed "></div>').appendTo('body');
        findAndCreateNeuvopacks();

        intercept('https://www.dreadcast.net/Check', (e) => updateNeuvopack(e.response));
        intercept('https://www.dreadcast.net/Main/InventoryBox', (e) => updateNeuvopack(e.response));
        intercept('https://www.dreadcast.net/Item/Move', recalculateStatusesOnItemMove);

        actionActuelleObserver = new MutationObserver((mutations, _) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    updateResearchTimer();
                    return;
                }
            });
        });
        actionActuelleObserver.observe(document.getElementById('action_actuelle'), { childList: true, subtree: true });

        annexeInventaireObserver = new MutationObserver(() => {
            const _neuvopacks = $('.objet_type_Neuvopack.ui-draggable').parent();
            _neuvopacks.unbind('click');
            setActionsOnNeuvopacks(_neuvopacks);
        });
        annexeInventaireObserver.observe(document.getElementById('annexe_inventaire_ext'), { childList: true, subtree: true });

        zoneConteneurObserver = new MutationObserver(() => {
            const _neuvopacks = $('.objet_type_Neuvopack.ui-draggable').parent();
            _neuvopacks.unbind('click');
            setActionsOnNeuvopacks(_neuvopacks);
            findAndCreateNeuvopacks();
        });
        zoneConteneurObserver.observe(document.getElementById('zone_conteneurs_displayed'), { childList: true, subtree: true });

        $(neuvopackOverhaulStyleSheet).appendTo('head');
    }, 1000);
});

const neuvopackOverhaulStyleSheet = `<style type='text/css'>
.no_progress {
    display: flex;
    width: 150px;
    height: 16px;
    border: 1px solid #fff;
    padding: 1px;
    box-shadow: 0 0 10px #aaa;
    margin: auto;
    margin-right: 1px;
}

.no_progress .no_bar {
    position: absolute;
    height: 90%;
    background-repeat: repeat;
    animation: shine 7s ease-in infinite;
}

@keyframes shine {
    0% { background-position: 0 0; }
    100% { background-position: 0 45px; }
}

circle {
    transition: all 1s linear;
}

line {
    transition: all 1s linear;
}

.no_auto_margin {
    margin: auto;
}

.no_bar {
    transition: all 1s linear;
    stroke: #ddd;
    stroke-width: 3;
    stroke-linecap: round;
    fill: transparent;
}

.no_outer_bar {
    stroke: #222;
}

.no_inner_bar {
    stroke: #ddd;
}

.no_centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.no_white {
    color: #ddd;
}

.no_small_text {
    font-size: 14px;
    line-height: 10px;
}

.no_bottom_section {
    margin: auto;
    display: flex;
    flex-direction: row;
}

.no_eject {
    margin: auto;
    margin-left: 1px;
    font-size: 12px;
}

.no_fill_level {
    color: white;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    line-height: 14px;
    z-index: 1;
}

.no_neuvo_info_item {
    margin: 8px 0px 0px 8px;
    font-size: 14px;
    color: #eee;
}

#zone_neuvopack_displayed {
    top: 0px;
    left: 0px;
}

.no_monochrome_fill_bar {
    display: flex;
    top: 5px;
    width: fit-content;
    margin: 5px auto 0px auto;
}
</style>`;
