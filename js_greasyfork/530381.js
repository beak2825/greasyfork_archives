// ==UserScript==
// @name        P.A.N. Fenestra
// @namespace   Violentmonkey Scripts
// @match       https://www.dreadcast.net/Forum
// @match       https://www.dreadcast.net/Forum*
// @version     1.0.0
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
// @downloadURL https://update.greasyfork.org/scripts/530381/PAN%20Fenestra.user.js
// @updateURL https://update.greasyfork.org/scripts/530381/PAN%20Fenestra.meta.js
// ==/UserScript==

$(() => {
  const syncParams = () => {};

  const initPersistence = () => {
    syncParams();
  };

  const loadUI = () => {};

  const loadStyle = () => {
    const style = `
      #liste_sujets {
        display: flex;
        flex-flow: row wrap;
        gap: 2rem 1rem;
        justify-content: center;
      }

      #liste_sujets .sujet {
        display: flex;
        width: 8rem;
        height: 10rem;
        overflow: hidden;
        clip-path: polygon(0% 0%, /*left top */
                    calc(100% - 2rem) -1px, /** right top start fold 40px = 2 times border width**/
                    100% 2rem, /** right top end fold 40px = 2 times border width **/
                    100% calc(2rem + 5px), /** right top move down 5px for box shadow offset down **/
                    calc(100% + 5px) calc(2rem + 10px), /** right top move 6 right for clipping(shadow offset + spread), add 5 to 44 from top offset to follow fold angle **/
                    calc(100% + 5px)  calc(100% + 5px), /** right bottom   **/
                    0% calc(100% + 5px) /** left bottom  **/
                    );
        box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.59);
      }

      #liste_sujets .sujet:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-width: 0 2rem 2rem 0;
        border-style: solid;
        border-color:  #e5e5e5 #e5e5e5 #444 #444;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,0.3), -1px 1px 1px rgba(0,0,0,0.2);
        -moz-box-shadow: 0 1px 1px rgba(0,0,0,0.3), -1px 1px 1px rgba(0,0,0,0.2);
        box-shadow: 0 1px 1px rgba(0,0,0,0.3), -1px 1px 1px rgba(0,0,0,0.2);
      }

      #liste_sujets .sujet .icon {
        top: unset !important;
        bottom: 0.5rem !important;
        left: 0.5rem !important;
      }

      #liste_sujets .sujet .info_vu {
        top: 0.5rem !important;
        left: 0.5rem !important;
      }

      .info_nb_messages {
        text-align: right;
      }

      #liste_sujets .sujet h3,
      #liste_sujets .folder h3 {
        left: unset !important;
        margin: 3rem 0.5rem 0 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        text-wrap: auto;
        line-break: auto;
      }

      #liste_sujets .folder h3 {
        font-size: 12px;
        color: #444;
        text-align: center;
      }

      .folder {
        width: 10rem;
        height: 7rem;
        margin-top: 2rem;
        position: relative;
        background-color: #d3d3d3;
        border-radius: 0 6px 6px 6px;
        box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.59);
      }

      .folder:before {
        content: '';
        width: 50%;
        height: 12px;
        border-radius: 0 20px 0 0;
        background-color: #d3d3d3;
        position: absolute;
        top: -12px;
        left: 0px;
      }

      .folder:hover,
      .folder:hover::before {
        background-color: #cacaca !important;
      }

      #list_labels {
        display: none;
      }

      #pan_actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.25rem;
        position: absolute;
        top: 2rem;
        right: 0;
      }

      #pan_actions .tooltip #pan_add_file {
        text-transform: uppercase;
        font-weight: 400;
        font-size: 12px;
      }

      #pan_actions .tooltip .tooltiptext {
        font-size: 11px;
      }
    `;

    DC.Style.apply(style);
  };

  const getFolders = () => {
    const labels = $('#list_labels ul li a');
    const res = [];
    for (let i = labels.length - 1; i >= 0; --i) {
      res.push({
        tag: labels[i].text,
        levels: labels[i].text.split(':'),
      });
    }
    return res;
  };

  const addFolders = (folders, level) => {
    folders.forEach((folder) => {
      $('#liste_sujets').prepend(
        $(`
        <a class="folder" href="https://www.dreadcast.net/Forum/Tag/${folder.levels
          .slice(0, level + 1)
          .join(':')}">
          <h3><span class="nom_sujet">${folder.levels[level]}</span></h3>
        </a>
      `),
      );
    });
  };

  const removeFiles = (folders) => {
    $('#liste_sujets a.sujet').each(function () {
      let sorted = false;
      $('.tag', $(this)).each(function () {
        sorted =
          sorted ||
          folders.find((folder) =>
            folder.tag.includes($(this).text().split(':')[0]),
          );
      });
      if (sorted) {
        $(this).hide();
      }
    });
  };

  const getCurrentUrl = () => {
    return $(location).attr('href').match('.*Forum/1-([0-9]*).*')?.[1];
  };

  const getCurrentTag = () => {
    return $(location).attr('href').match('.*Forum/Tag/(.*)')?.[1];
  };

  const removeDupes = (arr, level, map = new Map()) => {
    arr.forEach((o) => map.set(o.levels.slice(0, level + 1).join(':'), o));
    return [...map.values()];
  };

  const addActions = () => {
    $('#list_actions li:first').hide();
    $('#header_forum').append($('<div id="pan_actions" />'));
    $('#pan_actions').append(
      DC.UI.Tooltip(
        'Nouveau fichier matriciel',
        DC.UI.Button('pan_add_file', '+ Nouvel EM', () => {
          $('#zone_reponse').show();
        }),
      ),
    );
  };

  const addBreadcrumb = (currentFolder) => {
    const breadcrumb = $(`
      <h1>
        <a href="https://www.dreadcast.net/Forum">Forum Extra</a>
        <span style="color:#000">»</span>
        <a href="https://www.dreadcast.net/Forum/1-22-forum-prive">Forum Privé</a>
      </h1>
    `);

    for (let i = 0; i < currentFolder.length; ++i) {
      $(breadcrumb).append(
        $(`
        <span style="color:#000"> » </span>
      `),
      );
      if (i === currentFolder.length - 1) {
        $(breadcrumb).append(
          $(`<span style="color:#444;">${currentFolder[i]}</span>`),
        );
      } else {
        $(breadcrumb).append(
          $(
            `<a href="https://www.dreadcast.net/Forum/Tag/${currentFolder
              .slice(0, i + 1)
              .join(':')}">${currentFolder[i]}</span>`,
          ),
        );
      }
    }
    $('#header_forum h1').hide();
    $('#header_forum').prepend(breadcrumb);
  };

  const createUI = () => {
    const url = getCurrentUrl();
    const tag = getCurrentTag();
    const folders = getFolders();
    if (url === '22') {
      // FPs
      const topFolders = removeDupes(folders, 0);
      addFolders(topFolders, 0);
      removeFiles(folders);
      addActions();
    } else if (url === undefined && tag !== undefined) {
      // Tag
      const currentLevel = tag.split(':').length - 1;
      const subFolders = removeDupes(
        folders.filter(
          (folder) =>
            folder.tag.includes(tag) && folder.levels.length > currentLevel + 1,
        ),
        currentLevel + 1,
      );
      addFolders(subFolders, currentLevel + 1);
      addActions();
      addBreadcrumb(tag.split(':'));
    }
  };

  $(document).ready(function () {
    initPersistence();

    createUI();

    loadUI();
    loadStyle();
  });
});
