// ==UserScript==
// @name        Visio 3D
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     1.4.2
// @author      Pelagia/IsilinBN
// @description 13/11/2023 02:55:01
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js?version=1533476
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     update.greasyfork.org
// @connect     docs.google.com
// @connect     googleusercontent.com
// @connect     sheets.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/481981/Visio%203D.user.js
// @updateURL https://update.greasyfork.org/scripts/481981/Visio%203D.meta.js
// ==/UserScript==

$(() => {
  // HACK ME IF YOU CAN
  let hackMe = false;

  // ====== Lib Functions =====
  function getUrl(element) {
    var bg = $(element).css('background-image');
    bg = bg.replace('url(', '').replace(')', '').replace(/\"/gi, '');
    return bg;
  }

  function getIdFromUrl(url) {
    return url.replace(/(.*)[\_|\/](\d{1,5})\.(.*)/gi, '$2');
  }

  // ===== Core Functions =====
  function getPlan(type) {
    if (type !== 'hd' && type !== 'ld') {
      throw new Error("Plan type should be 'hd' or 'ld' only !");
    }

    var id = getIdFromUrl(getUrl('#carte_fond'));
    return (
      'https://www.dreadcast.net/images/batiments/' +
      type +
      '/batiment_' +
      id +
      '.png'
    );
  }

  var originalPlan = getUrl('#carte_fond');

  // ===== GUI Interaction =====
  function refreshUI() {
    originalPlan = getUrl('#carte_fond');

    $('#infoScanPanel').remove();

    const content = $(`
      <div id="infoScanPanel">
        <div id='scanTitre' class='titre'>Scan 3D - Lieu ID#${getIdFromUrl(
          originalPlan,
        )}</div>
        <div id='info'>
          <div id='scanNomLieu'>${$('#lieu_actuel .titre1').text()}</div>
          <div id='scanAdressLieu'>${$('#lieu_actuel .titre2').text()}</div>
        </div>
        <div class='planButton'></div>
        <div class='overview'>
          <img id="planOverview" src="${originalPlan}" height="120" />
          <div id="planOverlay"></div>
        </div>
        <div class='decoButton'></div>
        <div id='formNewMap'>
          <input id='urlNewMap' class='text_chat' type='text' placeholder="Url du plan..." />
          <button class='text_valider transition3s' id="testMap">▶</button>
          <button class='text_valider transition3s' id="resetMap">⟳</button>
        </div>
      </div>
    `);

    $('.planButton', content).append(
      DC.UI.TextButton('planHD', 'Plan HD', () => {
        var url = getPlan('hd');
        window.open(url, '_blank').focus();
      }),
    );
    $('.planButton', content).append(
      DC.UI.TextButton('planLD', 'Plan LD', () => {
        var url = getPlan('ld');
        window.open(url, '_blank').focus();
      }),
    );

    $('.decoButton', content).append(
      DC.UI.TextButton('planDeco', 'Décoration', () => {
        var url = originalPlan;
        window.open(url, '_blank').focus();
      }),
    );

    $('#testMap', content).click(() => {
      $('#carte_fond').css(
        'background-image',
        'url(' + $('#urlNewMap').val() + ')',
      );
    });
    $('#resetMap', content).click(() => {
      $('#carte_fond').css('background-image', 'url(' + originalPlan + ')');
      $('#urlNewMap').val('');
    });

    $('#scanPanel_content').append(content);
  }

  // ===== Check equipments =====

  var allowedEquipments = [];

  function checkEquipments() {
    let equipments = [
      $('.zone_case1 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case2 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case3 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case4 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case5 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case6 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case-2 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case-1 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case10 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case11 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case12 > div > div > img')?.attr('id')?.split('_')[0],
      $('.zone_case13 > div > div > img')?.attr('id')?.split('_')[0],
    ];

    if (
      allowedEquipments.filter((value) => equipments.includes(value)).length >
        0 ||
      hackMe
    ) {
      $('#infoScanPanel').css('display', 'block');
      $('#refreshScanPanel').css('display', 'none');
    } else {
      $('#infoScanPanel').css('display', 'none');
      $('#refreshScanPanel').css('display', 'flex');
    }
  }

  var getIDs = function () {
    const API_KEY = 'AIzaSyAgS_cjEerpTKyHEZa6JjfUwAdxM91Vpuc';
    const SHEET_ID = '1AfzRlbZBh-DzpMNcXgM854D7xU6sxSuSbYQItMlUJKU';
    const SHEET_NAME = 'DB';
    const SHEET_RANGE = 'B2:B';

    DC.Network.loadSpreadsheet(
      SHEET_ID,
      SHEET_NAME,
      SHEET_RANGE,
      API_KEY,
      (result) => {
        allowedEquipments = result.flat();
        checkEquipments();
      },
    );
  };

  const HACK_ME_TAG = 'v3d_hack_me';

  const syncParams = () => {
    hackMe = DC.LocalMemory.get(HACK_ME_TAG);
  };

  const initPersistence = () => {
    DC.LocalMemory.init(HACK_ME_TAG, false);

    syncParams();
  };

  const loadUI = () => {
    const content = $('<div id="refreshScanPanel"></div>');

    $(content).append(
      DC.UI.TextButton('refreshScanScript', '⟳ Refresh', () => {
        checkEquipments();
      }),
    );

    DC.UI.SideMenu('scanPanel', 'Scan', content);

    refreshUI();
  };

  const loadStyle = () => {
    const style = `
      #visio3d_content, .sp_pos_input {
        color: white;
      }
      #visio3d_content .input_group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .rp_notif {
        font-size: 1rem;
      }

      #scanOptions {
        background-color: #000;
        color: #fff !important;
        box-shadow: 0 0 15px -5px inset #a2e4fc !important;
        padding: 10px;
        width: 200px;
      }

      .titre {
        text-transform: uppercase;
        font-size: 1rem;
      }

      .planButton, .overview, #formNewMap, .decoButton, #refreshScanPanel {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      #planHD, #planLD, #planDeco, #refreshScanScript {
        font-size: 12px;
        text-transform: uppercase;
      }

      .overview {
        margin-bottom: 0.5rem;
      }

      #planOverview, #planOverlay {
        transform: rotateX(55deg) rotateY(0deg) rotateZ(-45deg);
        transform-style: preserve-3d;
      }

      #planOverlay {
        position: absolute;
        left: 25px;
        top: -5px;
        right: 25px;
        height: 120px;
        background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
        background-repeat: repeat;
        animation: overlay-anim .2s infinite;
        opacity: .9;
        visibility: visible;
      }

      @keyframes overlay-anim {
        0% { transform: translate(0,0) }
        10% { transform: translate(-5%,-5%) }
        20% { transform: translate(-10%,5%) }
        30% { transform: translate(5%,-10%) }
        40% { transform: translate(-5%,15%) }
        50% { transform: translate(-10%,5%) }
        60% { transform: translate(15%,0) }
        70% { transform: translate(0,10%) }
        80% { transform: translate(-15%,0) }
        90% { transform: translate(10%,5%) }
        100% { transform: translate(5%,0) }
      }

      #formNewMap {
        position: relative;
        width: 85%;
        border: 1px solid #7ec8d8 !important;
        height: fit-content;
      }

      #urlNewMap {
        border: none;
        background: 0 0;
        color: #7ec8d8;
        width: 90%;
        padding: 3px;
        box-sizing: border-box;
        font-size: 1rem;
      }

      #testMap {
        background: #7ec8d8;
        color: #10426b;
        width: 10%;
        height: 100%;
        position: absolute;
        bottom: 0;
        right: 0;
        border: 1px solid #7ec8d8;
        border-width: 0 0 0 1px;
        display: grid;
      }

      #resetMap {
        background: #7ec8d8;
        color: #10426b;
        width: 10%;
        height: 100%;
        position: absolute;
        bottom: 0;
        right: -15%;
        border: 1px solid #7ec8d8;
        display: grid;
      }

      #testMap:hover, #resetMap:hover {
        color: #7ec8d8;
        background: 0 0;
      }

      #scanNomLieu, #scanAdressLieu {
        color: #999;
        text-transform: uppercase;
        font-size: 10px;
      }
    `;

    DC.Style.apply(style);
  };

  const openSettings = () => {
    let content = $(`
      <div id="visio3d_content">
        <div id="hack_check" class="input_group">
          <legend>Débrider le logiciel :</legend>
        </div>
        <span class="rp_notif">(Merci de favoriser une action RP avant de cocher cette case)</span>
      </div>
    `);

    $('#hack_check', content).append(
      DC.UI.Checkbox('hack_enable', hackMe, () => {
        hackMe = $('#hack_enable').hasClass('dc_ui_checkbox_on');
        DC.LocalMemory.set(HACK_ME_TAG, hackMe);

        checkEquipments();
      }),
    );

    DC.UI.PopUp('visio3d_modal', 'Visio 3D', content);
  };

  $(document).ready(function () {
    initPersistence();
    getIDs();

    if (Util.isDSM?.()) {
      $(document).on('click', '#visio3d_setting', openSettings);
    } else {
      DC.UI.addSubMenuTo(
        'Paramètres ▾',
        DC.UI.SubMenu('Visio3D', openSettings),
        6,
      );
    }

    loadUI();
    loadStyle();

    $(document).ajaxComplete(function (e, xhr, opt) {
      if (
        opt.url.includes('/Action/Enter') ||
        opt.url.includes('/Action/Move/x=0&y=0')
      ) {
        refreshUI();
      }
    });
  });
});
