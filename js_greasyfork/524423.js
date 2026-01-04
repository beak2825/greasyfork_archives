// ==UserScript==
// @name        Silhouette+
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Main
// @version     1.0.1
// @author      Pelagia/Isilin
// @description To fully customize RP sheets with silhouettes and more. Combine SkinSilhouette & ShowSilhouette.
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
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
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/524423/Silhouette%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/524423/Silhouette%2B.meta.js
// ==/UserScript==

$(() => {
  const API_KEY = 'AIzaSyCSnNrK0PQMz20JVuUmuO9rl9iSWRHrPm4';
  const SHEET_ID = '1Ygt9q6WEU8cR_86GptLpHZ6qLHATfX42R0qcPKaqvqo';
  const SHEET_NAME = 'BDD';
  const SHEET_RANGE = 'A:C';

  let silhouettesUrl = new Array();
  let silhouettesNom = new Array();

  const SHINY_DISABLE_TAG = 'sp_shiny_disable';
  const POSITIONS_TAG = 'sp_position';

  let shinyDisable;
  let positions;

  const syncParams = () => {
    shinyDisable = DC.LocalMemory.get(SHINY_DISABLE_TAG);
    positions = DC.LocalMemory.get(POSITIONS_TAG);
  };

  const initPersistence = () => {
    DC.LocalMemory.init(SHINY_DISABLE_TAG, false);
    DC.LocalMemory.init(POSITIONS_TAG, {
      head: { x: '0', y: '1', tag: '.zone_case1', label: 'Tête' },
      chest: { x: '0', y: '21', tag: '.zone_case5', label: 'Buste' },
      legs: { x: '0', y: '41', tag: '.zone_case-1', label: 'Jambes' },
      feet: { x: '0', y: '61', tag: '.zone_case6', label: 'Pieds' },
      implant: { x: '60', y: '1', tag: '.zone_case-2', label: 'Implant' },
      right_arm: { x: '60', y: '21', tag: '.zone_case3', label: 'Main D' },
      left_arm: { x: '60', y: '41', tag: '.zone_case4', label: 'Main G' },
      secondary: { x: '60', y: '61', tag: '.zone_case2', label: 'Secondaire' },
      bag1: { x: '80', y: '1', tag: '.zone_case7', label: 'Sac 1' },
      bag2: { x: '80', y: '21', tag: '.zone_case8', label: 'Sac 2' },
      bag3: { x: '80', y: '41', tag: '.zone_case9', label: 'Sac 3' },
      rp1: { x: '0', y: '-1850', tag: '.zone_case10', label: 'Case RP 1' },
      rp2: { x: '20', y: '-1850', tag: '.zone_case11', label: 'Case RP 2' },
      rp3: { x: '40', y: '-1850', tag: '.zone_case12', label: 'Case RP 3' },
      rp4: { x: '60', y: '-1850', tag: '.zone_case13', label: 'Case RP 4' },
      cut: { x: '80', y: '72', tag: '#ciseauxInventaire', label: 'Séparation' },
      delete: {
        x: '80',
        y: '83',
        tag: '#poubelleInventaire',
        label: 'Poubelle',
      },
      stats: { x: '91', y: '72', tag: '#statsInventaire', label: 'Stats' },
      stock: { x: '91', y: '83', tag: '#stockInventaire', label: 'Stock' },
    });

    syncParams();
  };

  const loadStyle = () => {
    const style = `
      #silhouettePlus_content, .sp_pos_input {
        color: white;
      }
      #silhouettePlus_content .input_group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .inventaire_content .personnage_image {
          top: 10% !important;
          left: 20% !important;
      }

      /* Fiche RP */
      .flipmobile-card-front .inventaire {
          left: 12.5% !important;
      }
    `;

    DC.Style.apply(style);
  };

  const loadSilhouettes = () => {
    DC.Network.loadSpreadsheet(
      SHEET_ID,
      SHEET_NAME,
      SHEET_RANGE,
      API_KEY,
      (result) => {
        result.forEach((silhouette) => {
          silhouettesUrl[silhouette[0]] = silhouette[2];
          if (silhouette.length >= 3) {
            silhouettesNom[silhouette[1].toLowerCase()] = silhouette[2];
          }
        });

        loadUI();
      },
    );
  };

  const loadSheetStyle = () => {
    DC.Style.apply(`
      ${Object.keys(positions)
        .map((item) => {
          DC.Style.apply(`
            ${positions[item].tag} {
              left: ${positions[item].x}% !important;
              top: ${positions[item].y}% !important;
            }
          `);
        })
        .join('')}

      .case_objet.linkBox::before, .case_objet.linkBox::after, .case_objet.linkBox:hover::before, .case_objet.linkBox:hover::after {
        display: ${shinyDisable ? 'none' : 'block'} !important;
      }
    `);
  };

  const loadUI = () => {
    const pseudo = $('#txt_pseudo').text().toLowerCase();
    if (silhouettesNom[pseudo]) {
      $('.personnage_image')
        .css('background-image', 'url(' + silhouettesNom[pseudo] + ')')
        .css('background-position', '0px 0px');
    }

    loadSheetStyle();
  };

  Engine.prototype.openPersoBox_sp = Engine.prototype.openPersoBox;
  Engine.prototype.openPersoBox = async function (i, n) {
    const result = Engine.prototype.openPersoBox_sp(i, n);
    $(document).one('ajaxStop', { idPerso: i }, (e, xhr, settings) => {
      if (silhouettesUrl[i]) {
        $('#zone_infoBoxFixed #ib_persoBox_' + i + ' .personnage_image')
          .css('background-image', 'url("' + silhouettesUrl[i] + '")')
          .css('background-position', '0px 0px');
      }

      loadSheetStyle();
    });
    return result;
  };

  const openSettings = () => {
    const onChangeShiny = () => {
      shinyDisable = $('#shiny_disable').hasClass('dc_ui_checkbox_on');
      DC.LocalMemory.set(SHINY_DISABLE_TAG, shinyDisable);

      loadSheetStyle();
    };

    const onChangePosition = (e, tag, item, axis) => {
      positions[item][axis] = e.target.value;
      DC.LocalMemory.set(POSITIONS_TAG, positions);

      loadSheetStyle();
    };

    let content = $(`
      <div id="silhouettePlus_content">
        <div id="shiny_check" class="input_group">
          <legend>Masquer brillance :</legend>
        </div>
        ${Object.keys(positions)
          .map(
            (item) => `
          <div class="input_group">
            <legend>${positions[item].label} :</legend>
            X
            <input
              id="${item}_x"
              class="sp_pos_input"
              type="number"
              value="${positions[item].x}"
            />
            Y
            <input
              id="${item}_y"
              class="sp_pos_input"
              type="number"
              value="${positions[item].y}"
              step="${positions[item].label.includes('RP') ? '50' : '1'}"
            />
          </div>
        `,
          )
          .join('')}
      </div>
    `);

    Object.keys(positions).forEach((item) => {
      $(document).on('change', `#${item}_x`, (e) =>
        onChangePosition(e, `${positions[item].tag}`, item, 'x'),
      );
      $(document).on('change', `#${item}_y`, (e) =>
        onChangePosition(e, `${positions[item].tag}`, item, 'y'),
      );
    });

    $('#shiny_check', content).append(
      DC.UI.Checkbox('shiny_disable', shinyDisable, onChangeShiny),
    );

    content.append(
      DC.UI.TextButton(
        'change_silhouette',
        'Changer la silhouette',
        function () {
          nav.getMessagerie().newMessage(
            'Phylène, Azra, Amaryllis, Pelagia',
            '[HRP] Silhouette',
            `[[ Bonjour,

  Je souhaiterai changer ma silhouette.
  Pseudo : ${$('#txt_pseudo').text()}
  ID : #XXXXX
  Silhouette : <url de la silhouette>
]]`,
          );
        },
      ),
    );

    DC.UI.PopUp('silhouettePlus_modal', 'Silhouette+', content);
  };

  $(document).ready(() => {
    initPersistence();
    loadSilhouettes();

    if (Util.isDSM?.()) {
      $(document).on('click', '#silhouettePlus_setting', openSettings);
    } else {
      DC.UI.addSubMenuTo(
        'Paramètres ▾',
        DC.UI.SubMenu('Silhouette+', openSettings),
        6,
      );
    }

    loadStyle();

    MenuInventaire.prototype.originalDisplayInfos =
      MenuInventaire.prototype.displayInfos;
    MenuInventaire.prototype.displayInfos = () => {
      const result = this.originalDisplayInfos();
      $(document).one('ajaxSuccess', (e, xhr, settings) => {
        Object.keys(positions).forEach((item) => {
          $(`.inventaire_content ${positions[item].tag}`).css(
            'cssText',
            $(`.inventaire_content ${positions[item].tag}`).css('cssText') +
              `left: ${positions[item].x}% !important; top: ${positions[item].y}% !important;`,
          );
        });
      });
      return result;
    };
  });
});
