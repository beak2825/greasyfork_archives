// ==UserScript==
// @name        Scouter
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Main
// @version     0.0.1
// @author      Pelagia/IsilinBN
// @description Un cibleur de nouvelle génération directement connecté à une base de données. Idéal pour les forces de l'Orient.
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @connect     docs.google.com
// @connect     googleusercontent.com
// @connect     sheets.googleapis.com
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/510463/Scouter.user.js
// @updateURL https://update.greasyfork.org/scripts/510463/Scouter.meta.js
// ==/UserScript==

$(() => {
  const style = `
    #scouter_content {
      color: white;
    }
    #scouter_content .input_group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    #scouter_content input[type=text] {
      padding: 4px 12px;
      display: inline-block;
      border: 1px solid #7ec8d8;
      box-sizing: border-box;
      width: 70%;
      color: white;
    }
    .scouter_infobox_buttons {
      display: flex;
      position: absolute;
      bottom: -30px;
      left: -2px;
      width: auto;
      background-color: #181818;
      color: white;
    }
    .scouter_infobox_buttons .btn {
      border: 1px solid white;
      display: grid;
    }
    .scouter_infobox_buttons .btn:hover {
      background-color: #484848;
    }
    .interieur.data_info, .interieur.data_stats, .interieur.data_crim {
      color: #eee;
    }
    .interieur.data_info h4, .interieur.data_stats h4, .interieur.data_crim h4 {
      margin-bottom: 1rem;
    }
    .data_info_list, .data_stats_list, .data_crim_list {
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 13px;
      gap: 0.5rem;
    }
  `;

  const API_TAG = 'scouter_db_api';
  const SHEET_ID_TAG = 'scouter_sheet_id';
  const SHEED_NAME_TAG = 'scouter_sheet_name';
  const SHEET_RANGE_TAG = 'scouter_sheet_range';

  let api, sheetId, sheetName, sheetRange;
  let data;

  const syncParams = () => {
    api = DC.LocalMemory.get(API_TAG);
    sheetId = DC.LocalMemory.get(SHEET_ID_TAG);
    sheetName = DC.LocalMemory.get(SHEED_NAME_TAG);
    sheetRange = DC.LocalMemory.get(SHEET_RANGE_TAG);
  };

  const initPersistence = () => {
    DC.LocalMemory.init(API_TAG, 'AIzaSyAgS_cjEerpTKyHEZa6JjfUwAdxM91Vpuc');
    DC.LocalMemory.init(
      SHEET_ID_TAG,
      '1VgeD1CghIxgP-5AfkKV7woLm4CXqVLQ53XSHH7vHZZk',
    );
    DC.LocalMemory.init(SHEED_NAME_TAG, 'Data');
    DC.LocalMemory.init(SHEET_RANGE_TAG, 'A:T');

    syncParams();
  };

  const loadData = () => {
    DC.Network.loadSpreadsheet(
      sheetId,
      sheetName,
      sheetRange,
      api,
      (result) => {
        data = result;
      },
    );
  };

  const openSettings = () => {
    const save = () => {
      DC.LocalMemory.set(API_TAG, $('#input_api').val());
      DC.LocalMemory.set(SHEET_ID_TAG, $('#input_sheet_id').val());
      DC.LocalMemory.set(SHEED_NAME_TAG, $('#input_sheet_name').val());
      DC.LocalMemory.set(SHEET_RANGE_TAG, $('#input_sheet_range').val());

      syncParams();
      loadData();
      engine.closeDataBox('scouter_modal');
    };

    let content = $(`
      <div id="scouter_content">
        <div class="input_group">
          <legend>Api :</legend><input id="input_api" type="text" value="${api}" />
        </div>
        <div class="input_group">
          <legend>Id :</legend><input id="input_sheet_id" type="text" value="${sheetId}" />
        </div>
        <div class="input_group">
          <legend>Onglet :</legend><input id="input_sheet_name" type="text" value="${sheetName}" />
        </div>
        <div class="input_group">
          <legend>Plage :</legend><input id="input_sheet_range" type="text" value="${sheetRange}" />
        </div>
      </div>
    `).append(DC.UI.TextButton('scouter_save', 'Sauvegarder', save));

    DC.UI.PopUp('scouter_modal', 'Scouter', content);
  };

  const loadUI = (id) => {
    let secondaire = $(
      '.zone_case2 .case_objet_type_Secondaire .obj_itemBox_details .titreinfo',
    ).text();

    // TODO remove true for prod
    if (secondaire === 'Cibleur' || true) {
      // this not set with arrow function
      const charData = data.find((row) => row[0] === id);

      const user_content = $(`#ib_persoBox_${id} .flipmobile-card-front`).clone(
        true,
      );

      $(`
          <div id="buttons_${id}" class="scouter_infobox_buttons">
          </div>
        `)
        .append(
          DC.UI.Button(`set_${id}`, '<i class="fas fa-user" />', () => {
            $(`#ib_persoBox_${id} .flipmobile-card-front`).replaceWith(
              user_content.clone(true),
            );
            $(`#buttons_${id}>div`).css('background-color', '');
            $(`#set_${id}`).css('background-color', '#484848');
          }),
        )
        .append(
          DC.UI.Button(`info_${id}`, '<i class="fas fa-info" />', () => {
            $(`#ib_persoBox_${id} .flipmobile-card-front`)
              .empty()
              .append(
                $(`
                  <div class="interieur data_info">
                    <h4>Infos</h4>
                    <div class="data_info_list">
                      <div><span class="couleur0">Méta-race :</span> <span class="couleur5">${charData[3]}</span></div>
                      <div><span class="couleur0">Genre :</span> <span class="couleur5">${charData[4]}</span></div>
                      <div><span class="couleur0">Âge :</span> <span class="couleur5">${charData[5]} ans</span></div>
                      <div><span class="couleur0">Taille:</span> <span class="couleur5">${charData[6]}cm</span></div>
                      <div><span class="couleur0">Poids :</span> <span class="couleur5">${charData[7]}kg</span></div>
                      <br />
                      <div><span class="couleur0">Statut :</span> <span class="couleur5">${charData[20]}</span></div>
                      <div><span class="couleur0">Emploi :</span> <span class="couleur5">${charData[21]}</span></div>
                      <br />
                      <div><span class="couleur0">Notes :</span> <span class="couleur5">${charData[8]}</span></div>
                    </div>
                  </div>
                `),
              );
            $(`#buttons_${id}>div`).css('background-color', '');
            $(`#info_${id}`).css('background-color', '#484848');
          }),
        )
        .append(
          DC.UI.Button(`health_${id}`, '<i class="fas fa-heartbeat" />', () => {
            $(`#ib_persoBox_${id} .flipmobile-card-front`)
              .empty()
              .append(
                $(`
                  <div class="interieur data_stats">
                    <h4>Statistiques</h4>
                    <div class="data_stats_list">
                      <div>
                        <div><span class="couleur0">Santé :</span> <span class="couleur5">${charData[10]}</span></div>
                        <div><span class="couleur0">Forme :</span> <span class="couleur5">${charData[11]}</span></div>
                      </div>
                      <div>
                        <div><span class="couleur0">FOR :</span> <span class="couleur5">${charData[12]}</span></div>
                        <div><span class="couleur0">AGI :</span> <span class="couleur5">${charData[13]}</span></div>
                        <div><span class="couleur0">RES :</span> <span class="couleur5">${charData[14]}</span></div>
                      </div>
                      <div>
                        <div><span class="couleur0">PER :</span> <span class="couleur5">${charData[15]}</span></div>
                        <div><span class="couleur0">FUR :</span> <span class="couleur5">${charData[16]}</span></div>
                      </div>
                      <div>
                        <div><span class="couleur0">INF :</span> <span class="couleur5">${charData[17]}</span></div>
                        <div><span class="couleur0">MED :</span> <span class="couleur5">${charData[18]}</span></div>
                        <div><span class="couleur0">ING :</span> <span class="couleur5">${charData[19]}</span></div>
                      </div>
                    </div>
                  </div>
                `),
              );
            $(`#buttons_${id}>div`).css('background-color', '');
            $(`#health_${id}`).css('background-color', '#484848');
          }),
        )
        .append(
          DC.UI.Button(`crim_${id}`, '<i class="fas fa-gavel" />', () => {
            $(`#ib_persoBox_${id} .flipmobile-card-front`)
              .empty()
              .append(
                $(`
                  <div class="interieur data_crim">
                    <h4>Casier</h4>
                    <div class="data_crim_list"></div>
                  </div>
                `),
              );

            charData[9].split('\n').forEach((crim) => {
              $(`<span class="couleur5">${crim}</span>`).appendTo(
                $('.data_crim_list'),
              );
            });

            $(`#buttons_${id}>div`).css('background-color', '');
            $(`#crim_${id}`).css('background-color', '#484848');
          }),
        )
        .appendTo($(`#ib_persoBox_${id}`));

      $(`#set_${id}`).css('background-color', '#484848');
    }
  };

  $(document).ready(() => {
    initPersistence();
    loadData();

    if (Util.isDSM?.()) {
      $('#scouter_setting').bind('click', openSettings);
    } else {
      DC.UI.addSubMenuTo(
        'Paramètres ▾',
        DC.UI.SubMenu('Scouter', openSettings),
        6,
      );
    }

    $(document).on('click', 'span.perso.link', function () {
      const id = $(this).attr('id').slice(9);
      $(document).one('ajaxSuccess', { idPerso: id }, (e, xhr, settings) => {
        loadUI(id);
      });
    });

    $(document).on('click', '#action_perso_fiche', function () {
      $(document).one('ajaxSuccess', (e, xhr, settings) => {
        const id = settings.data.slice(3);
        loadUI(id);
      });
    });

    $(document).on('click', '#meubles', function () {
      console.log('ok');
      $(document).one('ajaxSuccess', (e, xhr, settings) => {
        console.log(settings);
        const id = settings.data.slice(3);
        loadUI(id);
      });
    });

    DC.Style.apply(style);
  });
});
