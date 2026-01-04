// ==UserScript==
// @name        Dreadcast Script Manager
// @namespace   Dreadcast
// @match       https://www.dreadcast.net/Main
// @match       https://www.dreadcast.net/Forum
// @match       https://www.dreadcast.net/Forum/*
// @match       https://www.dreadcast.net/EDC
// @match       https://www.dreadcast.net/EDC/*
// @version     1.3.4
// @author      Pelagia/Isilin
// @description Centralize all dreadcast scripts in one single source, integrated to the game.
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
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
// @connect     raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/507383/Dreadcast%20Script%20Manager.meta.js
// ==/UserScript==

// TODO remplacer petit à petit les scripts par les versions locales nettoyées.
// TODO use a recent jquery with noConflict
// TODO Reset button in Com'Back reset all the settings from DCSM (including scripts then).

$(() => {
  // To check if a script is used in a DSM context.
  Util.isDSM = () => true;

  const LIST_TAG = 'dcsm_list';
  const ALL_DISABLED_TAG = 'dcsm_all_disabled';
  const INTRO_TAG = 'dcsm_intro_disabled';
  const DEV_MODE_TAG = 'dcsm_dev_mode';

  let settings, allDisabled, introDisabled, devMode;
  let newSettings, newAllDisabled, newDevMode;

  // ===== CORE =====

  const initPersistence = () => {
    // Init persistent memory if needed.
    DC.LocalMemory.init(LIST_TAG, {});
    DC.LocalMemory.init(ALL_DISABLED_TAG, false);
    DC.LocalMemory.init(INTRO_TAG, false);
    DC.LocalMemory.init(DEV_MODE_TAG, false);

    // TODO to delete at next major version.
    if (DC.LocalMemory.get('dcm_list') !== undefined) {
      DC.LocalMemory.set(LIST_TAG, DC.LocalMemory.get('dcm_list'));
      DC.LocalMemory.delete('dcm_list');
    }
    if (DC.LocalMemory.get('dcm_all_disabled') !== undefined) {
      DC.LocalMemory.set(
        ALL_DISABLED_TAG,
        DC.LocalMemory.get('dcm_all_disabled'),
      );
      DC.LocalMemory.delete('dcm_all_disabled');
    }

    // Load the current settings.
    settings = DC.LocalMemory.get(LIST_TAG);
    allDisabled = DC.LocalMemory.get(ALL_DISABLED_TAG);
    introDisabled = DC.LocalMemory.get(INTRO_TAG);
    devMode = DC.LocalMemory.get(DEV_MODE_TAG);
  };

  const synchronizeSettings = (settings, scripts) => {
    let tmp = settings;

    scripts.forEach((script) => {
      if (!Object.hasOwn(tmp, script.id)) {
        // Update the settings, if there is new scripts.
        tmp[script.id] = false;
      }
    });

    // Remove in settings, scripts that doesn't exist anymore.
    tmp = Object.keys(tmp)
      .filter(
        (key) => scripts.find((script) => script.id === key) !== undefined,
      )
      .reduce((obj, key) => {
        obj[key] = tmp[key];
        return obj;
      }, {});

    // Save the new settings in persistent memory.
    DC.LocalMemory.set(LIST_TAG, tmp);

    return tmp;
  };

  const createScriptLine = (script, index) => {
    const line = $(`
      <tr style="border-top: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
        <td style="padding: 5px 0 0 5px" rowspan="2">${index}</td>
        ${
          script.icon && script.icon !== ''
            ? `<td style="padding: 5px" rowspan="2"><img src="${script.icon}" width="48" height="48" /></td>`
            : '<td class="short" style="width: 58px;" rowspan="2" />'
        }
        <td style="padding: 5px 0; min-width: 120px; text-align: left;">${
          script.experimental ? '<span style="color: red;">[DEV]</span>' : ''
        } ${script.name || ''}</td>
        <td style="padding: 5px 0; min-width: 120px; text-align: left;"><small>${
          script.authors || ''
        }</small></td>
        <td class="enabled_cell" style="padding: 5px 0; display: flex; justify-content: center;"></td>
        <td class="setting_cell" style="padding: 5px 5px 0 0;"></td>
        <td class="doc_cell" style="padding: 5px 5px 0 0;"></td>
        <td class="rp_cell" style="padding: 5px 5px 0 0;"></td>
        <td class="contact_cell" style="padding: 5px 5px 0 0;"></td>
      </tr>
      <tr style="border-bottom: 1px solid white; border-left: 1px solid white; border-right: 1px solid white;">
        <td colspan="7" style="padding: 0 5px 5px 5px; text-align: left;"><small><em class="couleur5">${
          script.description || ''
        }</em></small></td>
      </tr>
    `);
    $('.enabled_cell', line).append(
      DC.UI.Tooltip(
        'Activer/Désactiver le script ne perdra pas sa configuration.',
        DC.UI.Checkbox(
          `${script.id}_check`,
          newSettings[script.id],
          () => (newSettings[script.id] = !newSettings[script.id]),
        ),
      ),
    );
    if (script.settings) {
      $('.setting_cell', line).append(
        DC.UI.Tooltip(
          'Settings',
          DC.UI.Button(
            `${script.id}_setting`,
            '<i class="fas fa-cog"></i>',
            () => {},
          ),
        ),
      );
    }
    if (script.doc && script.doc !== '') {
      $('.doc_cell', line).append(
        DC.UI.Tooltip(
          'Documentation',
          DC.UI.Button(`${script.id}_doc`, '<i class="fas fa-book"></i>', () =>
            window.open(script.doc, '_blank'),
          ),
        ),
      );
    }
    if (script.rp && script.rp !== '') {
      $('.rp_cell', line).append(
        DC.UI.Tooltip(
          'Topic RP',
          DC.UI.Button(
            `${script.id}_rp`,
            '<div class=""gridCenter>RP</div>',
            () => window.open(script.doc, '_blank'),
          ),
        ),
      );
    }
    if (script.contact && script.contact !== '') {
      $('.contact_cell', line).append(
        DC.UI.Tooltip(
          'Contact',
          DC.UI.Button(
            `${script.id}_rp`,
            '<i class="fas fa-envelope"></i>',
            () => nav.getMessagerie().newMessage(script.contact),
          ),
        ),
      );
    }

    return line;
  };

  const createIntro = () => {
    if (Util.isGame() && !introDisabled) {
      introDisabled = true;
      DC.LocalMemory.set(INTRO_TAG, introDisabled);
      DC.UI.PopUp(
        'dcsm_intro',
        'Bienvenue sur le Dreadcast Script Manager !',
        $(`
          <div style="color: white;">
            <h3>Merci d'avoir installé le DreaCast Script Manager (DCSM).</h3><br />
            <p>Cet utilitaire va vous permettre de gérer vos scripts directement en jeu. Pensez à désactiver/désinstaller dans votre GreaseMonkey/TamperMonkey (ou équivalent), les scripts que vous activerez dans le DCSM, pour éviter des doublons.</p><br />
            <p>La suite se passe dans Paramètres > Scripts & Skins.</p><br />
            <p>Vous pourrez obtenir des réponses à vos questions sur le <a href="https://github.com/Isilin/dreadcast-scripts/wiki">wiki</a>, sur le forum, ou en me contactant directement par Com' HRP : (<em>JD Pelagia</em>).</p><br />
            <p>Bon jeu ! (Vous ne verrez plus cette fenêtre d'information par la suite).</p>
          </div>
        `),
      );
    }
  };

  const createUI = (scripts, settings) => {
    DC.UI.addSubMenuTo(
      'Paramètres ▾',
      DC.UI.SubMenu(
        'Scripts & Skins',
        () => {
          // On récupère une config temporaire qu'on appliquera uniquement si sauvegardée.
          newSettings = settings;
          newAllDisabled = allDisabled;
          newDevMode = devMode;

          const sections = [
            { id: 'all', label: 'Tous' },
            { id: 'game', label: 'Jeu' },
            { id: 'forum', label: 'Forum' },
            { id: 'edc', label: 'EDC' },
          ];

          const categories = [
            { id: 'all', label: 'Tous' },
            { id: 'mailing', label: 'Messagerie' },
            { id: 'chat', label: 'Chat' },
            { id: 'silhouette', label: 'Silhouette' },
            { id: 'ui', label: 'UI' },
            { id: 'mech', label: 'Mécaniques' },
            { id: 'fix', label: 'Correctifs' },
            { id: 'misc', label: 'Autres' },
          ];

          const content = $(`<div style="color: white;">
          <div id="developper_mode_switch" style="display: flex; justify-content: flex-begin;gap: 1rem;margin-bottom: 1rem;">
            <p>Mode développeur</p>
          </div>
          <div style="display: flex; justify-content: space-between">
            <div id="scripts_all_switch" style="display: flex;gap: 1rem;margin-bottom: 1rem;">
              <p>Tout désactiver</p>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <label for="search_script">Recherche</label>
                <input id="search_script" name="search_script" type="text" size="50" style="color: white;" />
            </div>
          </div>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <legend style="margin-right: 1rem; min-width: 60px;">Filtrer :</legend>
            <div style="display: flex; gap: 5%; flex-wrap: wrap; width: 100%;">
              ${sections
                .map(
                  (section, index) => `
                  <div>
                    <input type="radio" id="${
                      section.id
                    }_section" name ="section" value ="${section.id}" ${
                    index === 0 ? 'checked' : ''
                  } />
                    <label for="${section.id}_section">${section.label}</label>
                  </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <legend style="margin-right: 1rem; min-width: 60px;">Filtrer :</legend>
            <div style="display: flex; gap: 5%; flex-wrap: wrap; width: 100%;">
              ${categories
                .map(
                  (category, index) => `
                  <div>
                    <input type="radio" id="${
                      category.id
                    }_category" name ="category" value ="${category.id}" ${
                    index === 0 ? 'checked' : ''
                  } />
                    <label for="${category.id}_category">${
                    category.label
                  }</label>
                  </div>
              `,
                )
                .join('')}
            </div>
          </div>
          <div style="overflow-y: scroll; overflow-x: hidden; max-height: 350px;">
            <table style="border-collapse: collapse; width: 100%; border: 1px solid white; padding: 5px; font-size: 15px; text-align: center;">
              <thead>
                <th style="padding: 5px 0 5px 5px" scope="col">#</th>
                <th class="short" style="width:58px;" />
                <th style="padding: 5px 0 5px 0" scope="col">Nom</th>
                <th style="padding: 5px 0 5px 0" scope="col">Auteurs</th>
                <th style="padding: 5px 0 5px 0" scope="col">Actif</th>
                <th class="short" style="width: 40px;" />
                <th class="short" style="width: 40px;" />
                <th class="short" style="width: 40px;" />
                <th class="short" style="width: 40px;" />
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>`);

          $(document).on('change', "input[name='category']", (e) => {
            const category = e.target.value;
            const section = $("input[name='section']:checked").val();
            const search = $("input[name='search_script']").val().toLowerCase();

            // Empty the table
            $('tbody', content).empty();
            // Add filtered lines
            scripts
              .filter(
                (script) =>
                  (script.section.includes(section) || section === 'all') &&
                  (script.category.includes(category) || category === 'all') &&
                  (script.name.toLowerCase().includes(search) ||
                    script.description.toLowerCase().includes(search)),
              )
              .forEach((script, index) => {
                const line = createScriptLine(script, index);
                $('tbody', content).append(line);
              });
          });

          $(document).on('change', "input[name='section']", (e) => {
            const section = e.target.value;
            const category = $("input[name='category']:checked").val();
            const search = $("input[name='search_script']").val().toLowerCase();

            // Empty the table
            $('tbody', content).empty();
            // Add filtered lines
            scripts
              .filter(
                (script) =>
                  (script.section.includes(section) || section === 'all') &&
                  (script.category.includes(category) || category === 'all') &&
                  (script.name.toLowerCase().includes(search) ||
                    script.description.toLowerCase().includes(search)),
              )
              .forEach((script, index) => {
                const line = createScriptLine(script, index);
                $('tbody', content).append(line);
              });
          });

          $(document).on('input', "input[name='search_script']", (e) => {
            const search = e.target.value.toLowerCase();
            const category = $("input[name='category']:checked").val();
            const section = $("input[name='section']:checked").val();

            // Empty the table
            $('tbody', content).empty();
            // Add filtered lines
            scripts
              .filter(
                (script) =>
                  (script.section.includes(section) || section === 'all') &&
                  (script.category.includes(category) || category === 'all') &&
                  (script.name.toLowerCase().includes(search) ||
                    script.description.toLowerCase().includes(search)),
              )
              .forEach((script, index) => {
                const line = createScriptLine(script, index);
                $('tbody', content).append(line);
              });
          });

          // Sauvegarder les paramètres.
          content.append(
            DC.UI.TextButton('scripts_refresh', 'Sauvegarder', () => {
              settings = newSettings;
              allDisabled = newAllDisabled;
              devMode = newDevMode;
              DC.LocalMemory.set(LIST_TAG, settings);
              DC.LocalMemory.set(ALL_DISABLED_TAG, allDisabled);
              DC.LocalMemory.set(DEV_MODE_TAG, devMode);
              location.replace('https://www.dreadcast.net/Main'); // Better than reload() with Chrome.
            }),
          );
          content.append(
            $(
              `<p><em class="couleur5">⚠ Sauvegarder votre configuration va raffraichir la page.<br />
         Pensez à sauvegarder votre travail en cours avant.</em></p>`,
            ),
          );

          const resetConfig = () => {
            const list = DC.LocalMemory.list();
            list.forEach((key) => {
              DC.LocalMemory.delete(key);
            });
          };

          // Import/Export
          content.append(
            $(
              '<div id="config_buttons" style="display: flex; justify-content: end; gap: 1rem; margin-bottom: 1rem;"></div>',
            ),
          );
          $('#config_buttons', content).append(
            DC.UI.TextButton(
              'config_reset',
              '<i class="fas fa-undo"></i> Réinitialiser',
              () => {
                resetConfig();
                location.replace('https://www.dreadcast.net/Main');
              },
            ),
          );
          $('#config_buttons', content).append(
            DC.UI.TextButton(
              'config_import',
              '<i class="fas fa-upload"></i> Importer la configuration',
              () => {
                resetConfig();

                const anchor = document.createElement('input');
                anchor.style.display = 'none';
                anchor.type = 'file';
                anchor.accept = 'application.json';
                anchor.onchange = (e) => {
                  var reader = new FileReader();
                  reader.onload = (e) => {
                    const data = JSON.parse(e.target.result);
                    Object.keys(data).forEach((key) => {
                      DC.LocalMemory.set(key, data[key]);
                    });
                  };
                  reader.readAsText(e.target.files[0]);
                  document.body.removeChild(anchor);
                  location.replace('https://www.dreadcast.net/Main');
                };
                document.body.appendChild(anchor);
                anchor.click();
              },
            ),
          );
          $('#config_buttons', content).append(
            DC.UI.TextButton(
              'config_export',
              '<i class="fas fa-download"></i> Exporter la configuration',
              function () {
                const list = DC.LocalMemory.list();
                let data = {};
                list.forEach((key) => {
                  data[key] = DC.LocalMemory.get(key);
                });

                const anchor = document.createElement('a');
                anchor.style.display = 'none';
                anchor.href = URL.createObjectURL(
                  new Blob([JSON.stringify(data)], {
                    type: 'application/json',
                  }),
                );
                anchor.download = 'dcsm_config.json';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
              },
            ),
          );

          // Switch button pour désactiver tous les scripts.
          $('#scripts_all_switch', content).append(
            DC.UI.Checkbox(
              'scripts_all_check',
              newAllDisabled,
              () => (newAllDisabled = !newAllDisabled),
            ),
          );

          // Switch button pour le développeur mode.
          $('#developper_mode_switch', content).append(
            DC.UI.Tooltip(
              'Attention, ces scripts sont encore en développement !',
              DC.UI.Checkbox(
                'developper_mode_check',
                newDevMode,
                () => (newDevMode = !newDevMode),
              ),
            ),
          );

          scripts
            .filter((script) => devMode || !script.experimental)
            .forEach((script, index) => {
              const line = createScriptLine(script, index);
              $('tbody', content).append(line);
            });

          return DC.UI.PopUp('scripts_modal', 'Scripts & Skins', content);
        },
        true,
      ),
      5,
    );
  };

  // ===============
  $(document).ready(() => {
    initPersistence();
    createIntro();

    // Load list of scripts
    DC.Network.loadJson(
      'https://raw.githubusercontent.com/Isilin/dreadcast-scripts/main/data/scripts.json',
    )
      .then((scripts) => {
        settings = synchronizeSettings(settings, scripts);

        // Create the interface.
        if (Util.isGame()) {
          createUI(scripts, settings);
        }

        // Load the scripts
        if (!allDisabled) {
          const context = Util.getContext();

          scripts
            .filter((script) => script.section.includes(context))
            .filter((script) => devMode || !script.experimental)
            .forEach((script) => {
              if (settings[script.id]) {
                DC.Network.loadScript(script.url)
                  .then(() => {
                    console.info(
                      `DCSM - '${script.name}' script has been loaded successfully.`,
                    );
                  })
                  .catch((err) => {
                    console.error(
                      `DCSM - Error loading '${script.name}' script: ` + err,
                    );
                  });
              }
            });
        }
      })
      .catch((err) => {
        console.error('DCSM - Error loading the list of scripts :' + err);
      });
  });
});
