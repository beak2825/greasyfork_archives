// ==UserScript==
// @name         MZ - NT Player Search
// @namespace    douglaskampl
// @version      4.02
// @description  Searches for players who match min. requirements (NC/NCA only)
// @author       Douglas Vieira
// @match        https://www.managerzone.com/?p=national_teams&type=senior
// @match        https://www.managerzone.com/?p=national_teams&type=u21
// @icon         https://yt3.googleusercontent.com/ytc/AIdro_mDHaJkwjCgyINFM7cdUV2dWPPnL9Q58vUsrhOmRqkatg=s160-c-k-c0x00ffffff-no-rj
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      mzlive.eu
// @connect      api.github.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527163/MZ%20-%20NT%20Player%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/527163/MZ%20-%20NT%20Player%20Search.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const FONT_URL = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
    const STYLE = `.nt-search-fab{position:fixed;bottom:2rem;right:2rem;width:60px;height:60px;background:linear-gradient(135deg, #ff6e40, #ff5252, #448aff);border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:9998;cursor:pointer;transition:all .3s cubic-bezier(0.4,0,0.2,1);display:flex;justify-content:center;align-items:center}.nt-search-fab:hover{transform:scale(1.1);box-shadow:0 6px 16px rgba(83,11,237,.4)}.nt-search-fab i{color:white;font-size:24px;transition:transform .3s}.nt-search-fab.loading i{animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.nt-search-container{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#f0f0f0;padding:2rem;border-radius:12px;box-shadow:0 8px 32px rgba(83,11,237,.3),0 4px 8px rgba(0,0,0,.2);z-index:9999;visibility:hidden;width:800px;max-width:99%;opacity:0;transition:all .3s cubic-bezier(0.4,0,0.2,1);border:1px solid rgba(138,43,226,.1)}.nt-search-container.visible{visibility:visible;opacity:1;transform:translate(-50%,-50%) scale(1)}.nt-search-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid rgba(138,43,226,.2)}.nt-search-header h2{font-family:'Space Mono',monospace;margin:0;color:violet;font-size:1.5rem;text-shadow:0 0 10px rgba(138,43,226,.5)}.nt-search-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}.nt-search-field{display:flex;flex-direction:column;gap:.5rem}.nt-search-field label{color:#ff9966;font-size:.875rem;text-transform:uppercase;letter-spacing:1px}.nt-search-field select{padding:.75rem;border:1px solid rgba(138,43,226,.3);border-radius:8px;background:#1a1a2e;color:#f0f0f0;font-size:1rem;transition:all .2s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ff9966' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right .75rem center;background-size:1rem}.nt-search-field select:focus{outline:none;border-color:#ff9966;box-shadow:0 0 0 2px rgba(138,43,226,.2)}.nt-search-field select:disabled{opacity:0.5;cursor:not-allowed;background:#333}.nt-search-buttons{display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1rem}.nt-search-button{width:auto;max-width:300px;padding:0.5rem 1rem;background:#009b3a;color:#ffdf00;border:none;border-radius:8px;font-weight:500;font-size:0.9rem;cursor:pointer;transition:all .2s;text-transform:uppercase;letter-spacing:2px;box-shadow:0 4px 6px rgba(0,0,0,.1)}.nt-search-button:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 6px 8px rgba(0,0,0,.2)}.nt-search-button:disabled{opacity:0.5;cursor:not-allowed;background:#666}.nt-search-log{margin-top:1rem;padding:1rem;background:rgba(26,26,46,.3);border-radius:8px;font-family:monospace;font-size:.875rem;max-height:150px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#6366f1 #1a1a2e}.nt-search-log::-webkit-scrollbar{width:8px;height:8px}.nt-search-log::-webkit-scrollbar-track{background:#1a1a2e;border-radius:4px}.nt-search-log::-webkit-scrollbar-thumb{background:#6366f1;border-radius:4px}.nt-search-log::-webkit-scrollbar-thumb:hover{background:#4834d4}.nt-search-log-entry{margin-bottom:.5rem;padding:.5rem;background:rgba(26,26,46,.5);border-radius:4px;color:#00ffff;animation:slideIn 0.3s ease-out forwards;opacity:0;transform:translateX(-20px)}@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}.nt-search-guestbook-link{position:fixed;bottom:1rem;right:1rem;color:#ff9966;transition:all .2s}.nt-search-guestbook-link:hover{color:#6366f1;transform:scale(1.1)}.nt-search-country-select{width:200px}.nt-search-country-select select{width:100%}.nt-search-results-button{width:auto;max-width:300px;padding:0.5rem 1rem;background:#009b3a;color:#ffdf00;border:none;border-radius:8px;font-weight:500;font-size:0.9rem;cursor:pointer;transition:all .2s;text-transform:uppercase;letter-spacing:2px;box-shadow:0 4px 6px rgba(0,0,0,.1);display:none}.nt-search-results-button:hover{transform:translateY(-2px);box-shadow:0 6px 8px rgba(0,0,0,.2)}.nt-search-results-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#f0f0f0;padding:0;border-radius:12px;z-index:10001;width:90%;height:90vh;overflow:hidden;box-shadow:0 8px 32px rgba(83,11,237,.3);animation:modalSlideIn 0.3s ease-out forwards}@keyframes modalSlideIn{from{opacity:0;transform:translate(-50%,-48%)}to{opacity:1;transform:translate(-50%,-50%)}}.nt-search-results-header{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:1.5rem;background:inherit;border-bottom:1px solid rgba(138,43,226,.2);z-index:1}.nt-search-results-title{font-family:'Space Mono',monospace;margin:0;font-size:1.5rem;color:#fff;text-shadow:0 0 10px rgba(138,43,226,.5)}.nt-search-results-close{background:none;border:none;color:#ff9966;font-size:1.5rem;cursor:pointer;transition:all 0.2s;padding:0.5rem}.nt-search-results-close:hover{color:#6366f1;transform:scale(1.1)}.nt-search-results-content{padding:1.5rem;height:calc(90vh - 5rem);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#6366f1 #1a1a2e}.nt-search-results-content::-webkit-scrollbar{width:8px}.nt-search-results-content::-webkit-scrollbar-track{background:#1a1a2e}.nt-search-results-content::-webkit-scrollbar-thumb{background:#6366f1;border-radius:4px}.nt-search-results-content::-webkit-scrollbar-thumb:hover{background:#4834d4}.nt-search-players-container{display:flex;flex-wrap:wrap;gap:1.5rem;margin:1rem 0}.nt-search-player-card{display:flex;flex-direction:row;gap:1.5rem;background:rgba(26,26,46,.5);border-radius:8px;padding:1.5rem;transition:all .2s;border:1px solid rgba(138,43,226,.1);flex:1 1 calc(50% - 1.5rem);box-sizing:border-box;min-width:500px}.nt-search-player-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(83,11,237,.2)}.nt-search-player-summary{display:flex;flex-direction:column;flex-basis:45%;gap:.75rem}.nt-search-player-name{font-size:1.2rem;font-weight:bold;color:#fff;margin:0}.nt-search-player-name a{color:inherit;text-decoration:none}.nt-search-player-name a:hover{color:violet}.nt-search-player-details{display:flex;flex-direction:column;gap:.5rem;color:#ccc;font-size:0.875rem;margin-top:auto}.nt-search-player-details a{color:#ff9966;text-decoration:none;transition:color .2s ease-in-out}.nt-search-player-details a:hover{color:#fff;text-decoration:underline}.nt-search-skills-list{display:flex;flex-direction:column;gap:4px;flex-basis:55%}.nt-search-skill-row{display:flex;align-items:center;background:transparent;padding:0;box-shadow:none;min-height:24px}.nt-search-skill-name{font-size:.8rem;color:#f0f0f0;flex-basis:80px;margin-right:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nt-search-skill-value{display:flex;align-items:center;gap:4px;color:#ff9966;flex-shrink:0}.nt-search-skill-value img{height:.9em;width:auto;vertical-align:middle}.nt-search-skill-value-text{font-size:.8rem;white-space:nowrap}.nt-search-player-total-balls{font-weight:bold;color:#ffdf00;font-size:1rem}.nt-search-results-pagination{display:flex;justify-content:center;align-items:center;gap:1rem;padding:1rem 0;border-top:1px solid rgba(138,43,226,.1);border-bottom:1px solid rgba(138,43,226,.1);margin:0 -1.5rem 1rem -1.5rem}.nt-search-results-pagination.bottom{border-top:1px solid rgba(138,43,226,.1);border-bottom:none;margin-top:1rem;margin-bottom:0}.nt-search-results-pagination.top{border-bottom:1px solid rgba(138,43,226,.1);border-top:none;margin-bottom:1rem;margin-top:0}.nt-search-pagination-button{background:#1a1a2e;color:#f0f0f0;border:1px solid rgba(138,43,226,.3);border-radius:4px;padding:0.5rem 1rem;cursor:pointer;transition:all 0.2s}.nt-search-pagination-button:not(:disabled):hover{background:#2a2a4e;transform:translateY(-1px)}.nt-search-pagination-button:disabled{opacity:0.5;cursor:not-allowed}.nt-search-pagination-info{color:#ff9966;font-size:0.875rem}.nt-search-header-controls{display:flex;align-items:center;gap:1rem;position:relative}.nt-search-export-button-group .nt-search-export-button{background:#1a1a2e;color:#f0f0f0;border:1px solid rgba(138,43,226,.3);border-radius:4px;padding:0.5rem 1rem;cursor:pointer;transition:all 0.2s}.nt-search-export-button-group .nt-search-export-button:hover{background:#2a2a4e;transform:translateY(-1px)}.nt-search-export-options{display:none;position:absolute;top:100%;right:0;background:#1a1a2e;border:1px solid rgba(138,43,226,.3);border-radius:4px;padding:0.5rem;z-index:10;box-shadow:0 4px 8px rgba(0,0,0,.2);flex-direction:column;gap:0.5rem;width:200px}.nt-search-export-options.show{display:flex}.nt-search-export-options button{width:100%;text-align:left;background:transparent;color:#f0f0f0;border:none;padding:0.5rem 0.75rem;border-radius:4px;cursor:pointer}.nt-search-export-options button:hover{background:rgba(138,43,226,.2)}.nt-search-history-controls{display:flex;gap:1rem;}.nt-search-history-button{padding:0.5rem 1rem;background-color:transparent;color:#ff9966;border:1px solid #ff9966;border-radius:8px;cursor:pointer;transition:all .2s}.nt-search-history-button:hover{background-color:rgba(255,153,102,0.1);color:white}.nt-search-history-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%);color:#f0f0f0;border-radius:12px;z-index:10001;width:90%;max-width:1000px;height:80vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(83,11,237,.3);animation:modalSlideIn .3s ease-out forwards;border:1px solid rgba(138,43,226,.1)}.nt-search-history-header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;border-bottom:1px solid rgba(138,43,226,.2);flex-shrink:0}.nt-search-history-title{font-family:'Space Mono',monospace;margin:0;font-size:1.5rem;color:#fff;text-shadow:0 0 10px rgba(138,43,226,.5)}.nt-search-history-header-actions{display:flex;align-items:center;gap:1rem}.nt-search-history-content{padding:1.5rem;overflow-y:auto;flex-grow:1;scrollbar-width:thin;scrollbar-color:#6366f1 #1a1a2e}.nt-search-history-content::-webkit-scrollbar{width:8px}.nt-search-history-content::-webkit-scrollbar-track{background:#1a1a2e}.nt-search-history-content::-webkit-scrollbar-thumb{background:#6366f1}.nt-search-history-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem}.nt-search-history-item{background:rgba(26,26,46,.5);border:1px solid rgba(138,43,226,.1);border-radius:8px;padding:1rem;display:flex;justify-content:space-between;align-items:center;transition:background-color .2s ease}.nt-search-history-item:hover{background:rgba(26,26,46,.8)}.nt-search-history-item-info{display:flex;flex-direction:column;gap:.5rem;max-width:70%}.nt-search-history-item-timestamp{font-family:'Space Mono',monospace;color:#ff9966;font-size:.875rem}.nt-search-history-item-filters{font-size:.8rem;color:#ccc;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nt-search-history-item-actions{display:flex;gap:.5rem}.nt-search-history-item-actions .nt-search-button{padding:.4rem .8rem;font-size:.8rem;letter-spacing:1px;background:#1a1a2e;color:#f0f0f0;border:1px solid #6366f1}.nt-search-history-item-actions .nt-search-button.delete{border-color:#ff5252}.nt-search-history-empty{text-align:center;padding:4rem 0;color:#888;font-style:italic}`;
    const COUNTRIES_DATA = [{"code":"AL","name":"Albania","cid":45,"u21ntid":1043509,"ntid":855930},{"code":"DZ","name":"Algeria","cid":52,"u21ntid":1043510,"ntid":855937},{"code":"AD","name":"Andorra","cid":46,"u21ntid":1043511,"ntid":855931},{"code":"AO","name":"Angola","cid":64,"u21ntid":1043512,"ntid":855949},{"code":"AR","name":"Argentina","cid":240,"u21ntid":1043513,"ntid":100},{"code":"AU","name":"Australia","cid":246,"u21ntid":1043514,"ntid":101},{"code":"AT","name":"Austria","cid":242,"u21ntid":1043515,"ntid":102},{"code":"AZ","name":"Azerbaijan","cid":54,"u21ntid":1043516,"ntid":855939},{"code":"BD","name":"Bangladesh","cid":67,"u21ntid":1043517,"ntid":855952},{"code":"BY","name":"Belarus","cid":34,"u21ntid":1043518,"ntid":855919},{"code":"BE","name":"Belgium","cid":237,"u21ntid":1043519,"ntid":103},{"code":"BO","name":"Bolivia","cid":6,"u21ntid":1043520,"ntid":498680},{"code":"BA","name":"Bosnia and Herzegovina","cid":25,"u21ntid":1043521,"ntid":855910},{"code":"BR","name":"Brazil","cid":1,"u21ntid":1043522,"ntid":104},{"code":"BG","name":"Bulgaria","cid":11,"u21ntid":1043523,"ntid":498686},{"code":"CA","name":"Canada","cid":239,"u21ntid":1043524,"ntid":105},{"code":"CL","name":"Chile","cid":15,"u21ntid":1043525,"ntid":498690},{"code":"CN","name":"China","cid":21,"u21ntid":1043526,"ntid":768059},{"code":"CO","name":"Colombia","cid":17,"u21ntid":1043527,"ntid":498693},{"code":"CR","name":"Costa Rica","cid":37,"u21ntid":1043528,"ntid":855922},{"code":"HR","name":"Croatia","cid":24,"u21ntid":1043529,"ntid":61},{"code":"CY","name":"Cyprus","cid":32,"u21ntid":1043530,"ntid":855917},{"code":"CZ","name":"Czech Republic","cid":3,"u21ntid":1043531,"ntid":106},{"code":"DK","name":"Denmark","cid":231,"u21ntid":1043532,"ntid":107},{"code":"DO","name":"Dominican Republic","cid":49,"u21ntid":1043533,"ntid":855934},{"code":"EC","name":"Ecuador","cid":13,"u21ntid":1043534,"ntid":498688},{"code":"EG","name":"Egypt","cid":12,"u21ntid":1043535,"ntid":498687},{"code":"SV","name":"El Salvador","cid":55,"u21ntid":1043536,"ntid":855940},{"code":"EN","name":"England","cid":224,"u21ntid":1043537,"ntid":108},{"code":"EE","name":"Estonia","cid":252,"u21ntid":1043538,"ntid":109},{"code":"FO","name":"Faroe Islands","cid":31,"u21ntid":1043539,"ntid":855916},{"code":"FI","name":"Finland","cid":229,"u21ntid":1043540,"ntid":110},{"code":"FR","name":"France","cid":228,"u21ntid":1043541,"ntid":111},{"code":"GE","name":"Georgia","cid":58,"u21ntid":1043543,"ntid":855943},{"code":"DE","name":"Germany","cid":230,"u21ntid":1043544,"ntid":112},{"code":"GR","name":"Greece","cid":232,"u21ntid":1043545,"ntid":113},{"code":"GT","name":"Guatemala","cid":44,"u21ntid":1043546,"ntid":855929},{"code":"HN","name":"Honduras","cid":57,"u21ntid":1043547,"ntid":855942},{"code":"HU","name":"Hungary","cid":245,"u21ntid":1043548,"ntid":114},{"code":"IS","name":"Iceland","cid":10,"u21ntid":1043549,"ntid":498685},{"code":"IN","name":"India","cid":39,"u21ntid":1043550,"ntid":855924},{"code":"ID","name":"Indonesia","cid":251,"u21ntid":1043551,"ntid":117},{"code":"IR","name":"Iran","cid":41,"u21ntid":1043552,"ntid":855926},{"code":"IE","name":"Ireland","cid":249,"u21ntid":1043553,"ntid":115},{"code":"IL","name":"Israel","cid":2,"u21ntid":1043554,"ntid":116},{"code":"IT","name":"Italy","cid":226,"u21ntid":1043555,"ntid":118},{"code":"JO","name":"Jordan","cid":59,"u21ntid":1043556,"ntid":855944},{"code":"KZ","name":"Kazakhstan","cid":51,"u21ntid":1043557,"ntid":855936},{"code":"KE","name":"Kenya","cid":62,"u21ntid":1043558,"ntid":855947},{"code":"KW","name":"Kuwait","cid":61,"u21ntid":1043559,"ntid":855946},{"code":"KG","name":"Kyrgyzstan","cid":53,"u21ntid":1043560,"ntid":855938},{"code":"LV","name":"Latvia","cid":250,"u21ntid":1043561,"ntid":119},{"code":"LB","name":"Lebanon","cid":68,"u21ntid":1043562,"ntid":855953},{"code":"LI","name":"Liechtenstein","cid":42,"u21ntid":1043563,"ntid":855927},{"code":"LT","name":"Lithuania","cid":5,"u21ntid":1043564,"ntid":120},{"code":"LU","name":"Luxembourg","cid":38,"u21ntid":1043565,"ntid":855923},{"code":"DC","name":"MZ Country","cid":20,"u21ntid":1043572,"ntid":768061},{"code":"MK","name":"Macedonia","cid":33,"u21ntid":1043542,"ntid":855918},{"code":"MY","name":"Malaysia","cid":27,"u21ntid":1043566,"ntid":855912},{"code":"MT","name":"Malta","cid":30,"u21ntid":1043567,"ntid":855915},{"code":"MX","name":"Mexico","cid":4,"u21ntid":1043568,"ntid":121},{"code":"MD","name":"Moldova","cid":35,"u21ntid":1043569,"ntid":855920},{"code":"ME","name":"Montenegro","cid":70,"u21ntid":1043570,"ntid":855955},{"code":"MA","name":"Morocco","cid":43,"u21ntid":1043571,"ntid":855928},{"code":"NL","name":"Netherlands","cid":236,"u21ntid":1043573,"ntid":122},{"code":"NG","name":"Nigeria","cid":63,"u21ntid":1043574,"ntid":855948},{"code":"NI","name":"Northern Ireland","cid":69,"u21ntid":1043575,"ntid":855954},{"code":"NO","name":"Norway","cid":234,"u21ntid":1043576,"ntid":123},{"code":"PK","name":"Pakistan","cid":56,"u21ntid":1043577,"ntid":855941},{"code":"PA","name":"Panama","cid":29,"u21ntid":1043578,"ntid":855914},{"code":"PY","name":"Paraguay","cid":7,"u21ntid":1043579,"ntid":498681},{"code":"PE","name":"Peru","cid":16,"u21ntid":1043580,"ntid":498691},{"code":"PH","name":"Philippines","cid":40,"u21ntid":1043581,"ntid":855925},{"code":"PL","name":"Poland","cid":233,"u21ntid":1043582,"ntid":124},{"code":"PT","name":"Portugal","cid":243,"u21ntid":1043583,"ntid":125},{"code":"RO","name":"Romania","cid":247,"u21ntid":1043584,"ntid":126},{"code":"RU","name":"Russia","cid":9,"u21ntid":1043585,"ntid":498684},{"code":"SA","name":"Saudi Arabia","cid":60,"u21ntid":1043586,"ntid":855945},{"code":"SC","name":"Scotland","cid":254,"u21ntid":1043587,"ntid":127},{"code":"SN","name":"Senegal","cid":66,"u21ntid":1043588,"ntid":855951},{"code":"RS","name":"Serbia","cid":71,"u21ntid":1043589,"ntid":855956},{"code":"SG","name":"Singapore","cid":28,"u21ntid":1043590,"ntid":855913},{"code":"SK","name":"Slovakia","cid":23,"u21ntid":1043591,"ntid":855909},{"code":"SI","name":"Slovenia","cid":22,"u21ntid":1043592,"ntid":855807},{"code":"ZA","name":"South Africa","cid":18,"u21ntid":1043593,"ntid":498694},{"code":"KR","name":"South Korea","cid":48,"u21ntid":1043594,"ntid":855933},{"code":"ES","name":"Spain","cid":227,"u21ntid":1043595,"ntid":128},{"code":"SE","name":"Sweden","cid":205,"u21ntid":1043596,"ntid":129},{"code":"CH","name":"Switzerland","cid":235,"u21ntid":1043597,"ntid":130},{"code":"TH","name":"Thailand","cid":19,"u21ntid":1043598,"ntid":498695},{"code":"TT","name":"Trinidad & Tobago","cid":65,"u21ntid":1043599,"ntid":855950},{"code":"TN","name":"Tunisia","cid":50,"u21ntid":1043600,"ntid":855935},{"code":"TR","name":"Turkey","cid":253,"u21ntid":1043601,"ntid":131},{"code":"UA","name":"Ukraine","cid":26,"u21ntid":1043602,"ntid":855911},{"code":"AE","name":"United Arab Emirates","cid":47,"u21ntid":1043603,"ntid":855932},{"code":"US","name":"United States","cid":225,"u21ntid":1043604,"ntid":132},{"code":"UY","name":"Uruguay","cid":8,"u21ntid":1043605,"ntid":498683},{"code":"VE","name":"Venezuela","cid":14,"u21ntid":1043606,"ntid":498689},{"code":"VN","name":"Vietnam","cid":36,"u21ntid":1043607,"ntid":855921},{"code":"WL","name":"Wales","cid":248,"u21ntid":1043608,"ntid":133}];
    const MASSIVE_COUNTRIES = ['BR', 'CN', 'AR', 'SE', 'PL', 'TR'];
    const PLAYERS_PER_PAGE = 10;
    const ORDERED_SKILL_KEYS = [
        "speed", "stamina", "playIntelligence", "passing", "shooting", "heading",
        "keeping", "ballControl", "tackling", "aerialPassing", "setPlays", "experience"
    ];

    try {
        const response = await fetch(FONT_URL);
        if (response.ok) {
            const fontCss = await response.text();
            GM_addStyle(fontCss + STYLE);
        } else {
            throw new Error(`Failed to fetch font CSS, status: ${response.status}`);
        }
    } catch (error) {
        GM_addStyle(STYLE);
    }

    class Logger {
        constructor(container, flushInterval = 400) {
            this.container = container;
            this.flushInterval = flushInterval;
            this.queue = [];
            this.timeout = null;
            this.scheduled = false;
        }
        getTimestamp() {
            const now = new Date();
            return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        }
        log(message, type = 'info') {
            this.queue.push({ message: `${this.getTimestamp()} ${message}`, type });
            if (!this.scheduled) {
                this.scheduled = true;
                this.timeout = setTimeout(() => this.flush(), this.flushInterval);
            }
        }
        flush() {
            if (!this.queue.length || !this.container) {
                this.scheduled = false;
                return;
            }
            const fragment = document.createDocumentFragment();
            this.queue.forEach(({ message, type }) => {
                const entry = document.createElement('div');
                entry.className = `nt-search-log-entry ${type}`;
                entry.textContent = message;
                fragment.appendChild(entry);
            });
            this.container.appendChild(fragment);
            this.container.scrollTop = this.container.scrollHeight;
            this.queue = [];
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.scheduled = false;
        }
    }

    class HistoryManager {
        constructor(storageKey = 'MZ_NT_SEARCH_HISTORY') {
            this.storageKey = storageKey;
        }
        async getHistory() {
            const historyJson = await GM_getValue(this.storageKey, '[]');
            return JSON.parse(historyJson);
        }
        async saveSearch(searchData) {
            let history = await this.getHistory();
            history.unshift(searchData);
            await GM_setValue(this.storageKey, JSON.stringify(history));
        }
        async deleteSearch(timestamp) {
            let history = await this.getHistory();
            const newHistory = history.filter(entry => entry.timestamp !== timestamp);
            await GM_setValue(this.storageKey, JSON.stringify(newHistory));
        }
    }

    class RequestQueue {
        constructor(maxConcurrent = 5, delay = 100) {
            this.queue = [];
            this.maxConcurrent = maxConcurrent;
            this.delay = delay;
            this.running = 0;
            this.processed = 0;
        }
        add(request) {
            return new Promise((resolve, reject) => {
                const wrappedRequest = async () => {
                    try {
                        await new Promise(res => setTimeout(res, this.delay));
                        const result = await request();
                        this.processed++;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    } finally {
                        this.running--;
                        this.processNext();
                    }
                };
                this.queue.push(wrappedRequest);
                this.processNext();
            });
        }
        processNext() {
            while (this.running < this.maxConcurrent && this.queue.length > 0) {
                this.running++;
                const request = this.queue.shift();
                request();
            }
        }
        reset() {
            this.queue = [];
            this.running = 0;
            this.processed = 0;
        }
    }

    class ChunkProcessor {
        constructor(chunkSize = 25) {
            this.chunkSize = chunkSize;
        }
        async process(items, processFn, onChunkComplete) {
            const chunks = this.createChunks(items);
            let processed = 0;
            for (const chunk of chunks) {
                await Promise.all(chunk.map(processFn));
                processed += chunk.length;
                if (onChunkComplete) {
                    onChunkComplete(processed, items.length);
                }
                await new Promise(res => setTimeout(res, 50));
            }
        }
        createChunks(items) {
            const chunks = [];
            for (let i = 0; i < items.length; i += this.chunkSize) {
                chunks.push(items.slice(i, i + this.chunkSize));
            }
            return chunks;
        }
    }

    class NTPlayerParser {
        constructor(minRequirements) {
            this.minRequirements = minRequirements;
            this.logger = null;
        }
        parseSkills(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('.player_skills tr');
            if (!rows.length) {
                return null;
            }
            const skills = {};
            let totalBalls = 0;
            const totalBallsElement = doc.querySelector('td[title] span.bold');
            if (totalBallsElement) {
                totalBalls = parseInt(totalBallsElement.textContent, 10) || 0;
            }
            let skillRows = Array.from(rows);
            if (skillRows.length > ORDERED_SKILL_KEYS.length) {
                skillRows = skillRows.slice(0, ORDERED_SKILL_KEYS.length);
            }
            skillRows.forEach((row, index) => {
                const valueCell = row.querySelector('.skillval');
                if (!valueCell) {
                    return;
                }
                const rawValue = valueCell.textContent.replace(/[()]/g, "").trim();
                const value = parseInt(rawValue, 10);
                if (!isNaN(value)) {
                    skills[ORDERED_SKILL_KEYS[index]] = value;
                }
            });
            if (Object.keys(skills).length === 0) {
                return null;
            }
            ORDERED_SKILL_KEYS.forEach(key => {
                if (!(key in skills)) {
                    skills[key] = 0;
                }
            });
            if (!this.validateSkills(skills)) {
                return null;
            }
            return { skills, totalBalls };
        }
        validateSkills(skills) {
            return Object.entries(this.minRequirements)
                .filter(([key]) => key in skills && typeof skills[key] === 'number')
                .every(([key, minValue]) => skills[key] >= minValue);
        }
        async fetchAndParsePlayer(playerId, ntid, cid) {
            const url = `https://www.managerzone.com/ajax.php?p=nationalTeams&sub=search&ntid=${ntid}&cid=${cid}&type=national_team&pid=${playerId}&sport=soccer`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const html = await response.text();
                return this.parseSkills(html);
            } catch (error) {
                if (this.logger) {
                    this.logger.log(`Error parsing player ${playerId}: ${error.message}`, 'error');
                }
                return null;
            }
        }
    }

    class PlayerData {
        constructor(id, name, teamName, teamId, age, value, salary, totalBalls, skills) {
            this.id = id;
            this.name = name;
            this.teamName = teamName;
            this.teamId = teamId || null;
            this.age = age;
            this.value = value;
            this.salary = salary;
            this.totalBalls = totalBalls;
            this.skills = skills;
        }
        toJSON() {
            return {
                id: this.id,
                name: this.name,
                teamName: this.teamName,
                teamId: this.teamId,
                age: this.age,
                value: this.value,
                salary: this.salary,
                totalBalls: this.totalBalls,
                skills: this.skills,
            };
        }
        toExcelRow() {
            const row = {
                'ID': this.id,
                'Name': this.name,
                'Team': this.teamName,
                'Age': this.age,
                'Value': this.value,
                'Salary': this.salary,
                'Total Balls': this.totalBalls,
            };
            ORDERED_SKILL_KEYS.forEach(key => {
                row[NTPlayerSearcher.prototype.formatSkillName(key)] = this.skills[key] || 0;
            });
            return row;
        }
    }

    class NTPlayerSearcher {
        constructor() {
            this.requestQueue = new RequestQueue(5, 100);
            this.chunkProcessor = new ChunkProcessor(25);
            this.historyManager = new HistoryManager();
            this.isInitialized = false;
            this.isInitializing = false;
            this.isSearching = false;
            this.searchValues = {
                speed: 0, stamina: 0, playIntelligence: 0, passing: 0, shooting: 0, heading: 0,
                keeping: 0, ballControl: 0, tackling: 0, aerialPassing: 0, setPlays: 0, experience: 0,
                minAge: 16, maxAge: 40, totalBalls: 9, country: '', countryData: null
            };
            this.teamIds = new Set();
            this.playerIds = new Map();
            this.processedLeagues = 0;
            this.totalLeagues = 0;
            this.validPlayers = new Map();
            this.floatingButton = null;
            this.logger = null;
            this.countries = [];
            this.userCountry = null;
            this.username = null;
            this.currentResultsPage = 1;
            this.resultsListeners = { prev: null, next: null, esc: null };
        }
        async fetchTopPlayers(country, page = 0, isU21 = false) {
            try {
                const baseUrl = `https://mzlive.eu/mzlive.php?action=list&type=top100&mode=players&country=${country}&cy=EUR`;
                const url = isU21 ? `${baseUrl}&age=u21&page=${page}` : `${baseUrl}&page=${page}`;
                const response = await this.requestQueue.add(() =>
                    new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({ method: 'GET', url, onload: res => resolve(res), onerror: err => reject(err), ontimeout: () => reject(new Error(`Timeout fetching Top100 page ${page}`)) });
                    })
                );
                const data = JSON.parse(response.responseText);
                const players = (data.players || []).filter(player => {
                    return player.age >= this.searchValues.minAge && player.age <= this.searchValues.maxAge;
                });
                const playerEntries = players.map(player => [
                    player.id.toString(),
                    { id: player.id.toString(), name: player.name, teamName: player.team_name, teamId: player.team_id?.toString() || null, age: player.age, value: parseInt(player.value) || 0, salary: 0 }
                ]);
                this.playerIds = new Map([...this.playerIds, ...playerEntries]);
                return players.map(player => player.id.toString());
            } catch (error) {
                if (this.logger) this.logger.log(`Error fetching Top100 (page ${page}): ${error.message}`, 'error');
                return [];
            }
        }
        async fetchAllTop100Players(country) {
            const maxPages = MASSIVE_COUNTRIES.includes(country) ? 20 : 5;
            const isU21 = this.searchValues.maxAge <= 21;
            const pages = Array.from({ length: maxPages + 1 }, (_, i) => i);
            const chunkSize = 5;
            const results = [];
            if (this.logger) this.logger.log(`Fetching Top100 players...`);
            for (let i = 0; i < pages.length; i += chunkSize) {
                const chunk = pages.slice(i, i + chunkSize);
                const chunkResults = await Promise.all(
                    chunk.map(page => this.fetchTopPlayers(country, page, isU21))
                );
                results.push(...chunkResults);
                await new Promise(res => setTimeout(res, 100));
            }
            if (this.logger) this.logger.log(`Finished fetching Top100 players.`);
            return results.flat();
        }
        async fetchCountriesList() {
            return Promise.resolve(COUNTRIES_DATA);
        }
        async fetchUserCountry() {
            const usernameElem = document.querySelector('#header-username');
            if (!usernameElem) return { userCountry: null, username: null };
            const username = usernameElem.textContent.trim();
            try {
                const response = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${username}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                const parserError = xmlDoc.querySelector('parsererror');
                if (parserError) throw new Error(`XML parsing error: ${parserError.textContent}`);
                const countryCode = xmlDoc.querySelector('UserData')?.getAttribute('countryShortname') || null;
                return { userCountry: countryCode, username: username };
            } catch (error) {
                if (this.logger) this.logger.log(`Error fetching user data: ${error.message}`, 'error');
                return { userCountry: null, username: username };
            }
        }
        async checkUserRole(ntid, cid, username) {
            if (!ntid || !cid || !username) {
                if (this.logger) this.logger.log("Missing ntid, cid, or username for role check.", "warn");
                return false;
            }
            const url = `https://www.managerzone.com/ajax.php?p=nationalTeams&sub=team&ntid=${ntid}&cid=${cid}&type=national_team&sport=soccer`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const profileLinks = doc.querySelectorAll('table.padding a[href*="/?p=profile&uid="]');
                for (const link of profileLinks) {
                    if (link.textContent.trim() === username) {
                        if (this.logger) this.logger.log(`User confirmed as NC/NCA.`, 'info');
                        return true;
                    }
                }
                if (this.logger) this.logger.log(`${username} is not NC/NCA.`, 'info');
                return false;
            } catch (error) {
                if (this.logger) this.logger.log(`Error checking user role: ${error.message}`, 'error');
                return false;
            }
        }
        async firstThingsFirst() {
            this.isInitializing = true;
            this.showLoading();

            try {
                const [countries, { userCountry, username }] = await Promise.all([
                    this.fetchCountriesList(),
                    this.fetchUserCountry()
                ]);

                this.countries = countries || [];
                this.userCountry = userCountry;
                this.username = username;

                let isAuthorized = false;
                let userCountryData = null;

                if (this.userCountry && this.username && this.countries.length > 0) {
                    userCountryData = this.countries.find(c => c.code === this.userCountry);
                    if (userCountryData) {
                        const isU21Page = window.location.href.includes("type=u21");
                        const ntid = isU21Page ? userCountryData.u21ntid : userCountryData.ntid;
                        isAuthorized = await this.checkUserRole(ntid, userCountryData.cid, this.username);
                    }
                }

                const searchContainer = document.querySelector('.nt-search-container');
                const countrySelect = searchContainer?.querySelector('select[name="country"]');
                const searchButton = searchContainer?.querySelector('.nt-search-button');
                const allSelects = searchContainer?.querySelectorAll('select');

                if (isAuthorized && userCountryData) {
                    this.searchValues.country = this.userCountry;
                    this.searchValues.countryData = { ntid: userCountryData.ntid, u21ntid: userCountryData.u21ntid, cid: userCountryData.cid };
                    if (this.logger) this.logger.log(`Welcome, ${this.username}.`, 'info');
                    if (countrySelect) {
                        countrySelect.innerHTML = this.generateCountryOptions();
                        countrySelect.disabled = false;
                    }
                    if (allSelects) allSelects.forEach(s => s.disabled = false);
                    if (searchButton) searchButton.disabled = false;
                } else {
                    if (this.logger) this.logger.log("Search tool disabled.", "warn");
                    if (allSelects) allSelects.forEach(s => s.disabled = true);
                    if (searchButton) searchButton.disabled = true;
                    if (countrySelect) {
                        countrySelect.innerHTML = this.generateCountryOptions();
                        countrySelect.disabled = true;
                    }
                }
            } catch (error) {
                if (this.logger) this.logger.log(`Initialization failed: ${error.message}`, 'error');
                alert(`Initialization failed. Please check the browser console (F12) for more details.`);
            } finally {
                this.isInitialized = true;
                this.isInitializing = false;
                this.hideLoading();
                if (this.logger) this.logger.flush();
            }
        }
        initialize() {
            this.appendSearchTab();
            this.setUpEvents();
        }
        showLoading() {
            if (this.floatingButton) this.floatingButton.classList.add('loading');
        }
        hideLoading() {
            if (this.floatingButton) this.floatingButton.classList.remove('loading');
        }
        async getLeagueIds(countryCode) {
            try {
                const response = await this.requestQueue.add(() =>
                    new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({ method: 'GET', url: `https://mzlive.eu/mzlive.php?action=list&type=leagues&country=${countryCode}`, onload: res => resolve(res), onerror: err => reject(err), ontimeout: () => reject(new Error('Timeout fetching leagues')) });
                    })
                );
                const leagues = JSON.parse(response.responseText);
                const maxDivision = MASSIVE_COUNTRIES.includes(countryCode) ? 6 : 3;
                return leagues.filter(league => {
                    const name = league.name.toLowerCase();
                    if (name.startsWith('div')) {
                        const divLevel = parseInt(name.split('.')[0].replace('div', ''));
                        return isNaN(divLevel) || divLevel <= maxDivision;
                    }
                    return true;
                }).map(league => league.id);
            } catch (error) {
                if (this.logger) this.logger.log(`Error fetching leagues: ${error.message}`, 'error');
                return [];
            }
        }
        async getTeamIds(leagueId) {
            try {
                const response = await this.requestQueue.add(() => fetch(`https://www.managerzone.com/xml/team_league.php?sport_id=1&league_id=${leagueId}`));
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for league ${leagueId}`);
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                const parserError = xmlDoc.querySelector('parsererror');
                if (parserError) throw new Error(`XML parsing error for league ${leagueId}: ${parserError.textContent}`);
                const teams = xmlDoc.getElementsByTagName('Team');
                return Array.from(teams).map(team => team.getAttribute('teamId'));
            } catch (error) {
                if (this.logger) this.logger.log(`Error fetching teams for league ${leagueId}: ${error.message}`, 'error');
                return [];
            }
        }
        async processLeagueBatch(leagueIds) {
            if (!leagueIds || leagueIds.length === 0) {
                if (this.logger) this.logger.log("No league IDs to process.", "warn");
                return;
            }
            if (this.logger) this.logger.log(`Processing ${leagueIds.length} leagues...`);
            await this.chunkProcessor.process(
                leagueIds,
                async (leagueId) => {
                    try {
                        const teamIds = await this.getTeamIds(leagueId);
                        if (teamIds && teamIds.length > 0) teamIds.forEach(id => this.teamIds.add(id));
                        this.processedLeagues++;
                    } catch (error) {
                        if (this.logger) this.logger.log(`Failed to process league ${leagueId}: ${error.message}`, 'error');
                    }
                }
            );
            if (this.logger) this.logger.log(`Finished processing leagues. Found ${this.teamIds.size} unique teams.`);
        }
        async fetchPlayerList(teamId) {
            try {
                const response = await this.requestQueue.add(() => fetch(`https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`));
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for team ${teamId}`);
                const text = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "text/xml");
                const parserError = xmlDoc.querySelector('parsererror');
                if (parserError) throw new Error(`XML parsing error for team ${teamId}: ${parserError.textContent}`);
                const teamPlayers = xmlDoc.querySelector('TeamPlayers');
                if (!teamPlayers) return;
                const teamName = teamPlayers.getAttribute('teamName') || `Team ${teamId}`;
                const actualTeamId = teamPlayers.getAttribute('teamId') || teamId;
                const players = xmlDoc.getElementsByTagName('Player');
                const targetCountry = this.searchValues.country.toLowerCase();
                Array.from(players).forEach(player => {
                    const age = parseInt(player.getAttribute('age'));
                    const countryCode = (player.getAttribute('countryShortname') || '').toLowerCase();
                    if (age >= this.searchValues.minAge && age <= this.searchValues.maxAge && countryCode === targetCountry) {
                        const playerId = player.getAttribute('id');
                        const playerName = player.getAttribute('name');
                        const value = parseInt(player.getAttribute('value')) || 0;
                        const salary = parseInt(player.getAttribute('salary')) || 0;
                        if (playerId && playerName) {
                            this.playerIds.set(playerId, { id: playerId, name: playerName, teamName, teamId: actualTeamId, age, value, salary });
                        }
                    }
                });
            } catch (error) {
                if (this.logger) this.logger.log(`Error fetching players for team ${teamId}: ${error.message}`, 'error');
            }
        }
        async processTeamBatch(teamIds) {
            if (!teamIds || teamIds.length === 0) {
                if (this.logger) this.logger.log("No team IDs to process.", "warn");
                return;
            }
            const totalTeams = teamIds.length;
            let processedTeams = 0;
            if (this.logger) this.logger.log(`Processing ${totalTeams} teams...`);
            await this.chunkProcessor.process(
                teamIds,
                async (teamId) => {
                    await this.fetchPlayerList(teamId);
                    processedTeams++;
                    if (processedTeams % 100 === 0 || processedTeams === totalTeams) {
                        if (this.logger) this.logger.log(`Team processing: ${processedTeams}/${totalTeams}`);
                    }
                }
            );
            if (this.logger) this.logger.log(`Finished processing teams. Found ${this.playerIds.size} potential players.`);
        }
        async searchForPlayers() {
            if (!this.searchValues.country || !this.searchValues.countryData) {
                if (this.logger) this.logger.log('Country not selected or country data missing.', 'error');
                alert('Please ensure a country is selected.');
                return;
            }
            this.teamIds = new Set();
            this.playerIds = new Map();
            this.processedLeagues = 0;
            this.totalLeagues = 0;
            this.validPlayers = new Map();
            this.requestQueue.reset();
            this.currentResultsPage = 1;
            const countryCode = this.searchValues.country;
            if (this.logger) this.logger.log(`Starting search for country: ${countryCode}`);
            try {
                if (this.searchValues.maxAge > 18) {
                    await this.fetchAllTop100Players(countryCode);
                    if (this.logger) this.logger.log(`Found ${this.playerIds.size} players from Top100.`);
                }
                const leagueIds = await this.getLeagueIds(countryCode);
                this.totalLeagues = leagueIds.length;
                if (this.totalLeagues === 0 && this.playerIds.size === 0) {
                    if (this.logger) this.logger.log(`No leagues found and no top players matched. Stopping search.`, 'warn');
                    return;
                }
                await this.processLeagueBatch(leagueIds);
                await this.processTeamBatch(Array.from(this.teamIds));
                const isU21Page = window.location.href.includes("type=u21");
                const ntid = isU21Page ? this.searchValues.countryData.u21ntid : this.searchValues.countryData.ntid;
                const cid = this.searchValues.countryData.cid;
                const ntPlayerParser = new NTPlayerParser(this.searchValues);
                ntPlayerParser.logger = this.logger;
                const playerEntries = Array.from(this.playerIds.entries());
                if (playerEntries.length === 0) {
                    if (this.logger) this.logger.log('No potential players found after gathering IDs.', 'warn');
                    return;
                }
                if (this.logger) this.logger.log(`Processing skills for ${playerEntries.length} players...`);
                await this.chunkProcessor.process(
                    playerEntries,
                    async ([playerId, playerData]) => {
                        try {
                            const parsedData = await ntPlayerParser.fetchAndParsePlayer(playerId, ntid, cid);
                            if (parsedData && parsedData.totalBalls >= this.searchValues.totalBalls) {
                                this.validPlayers.set(playerId, new PlayerData(playerId, playerData.name, playerData.teamName, playerData.teamId, playerData.age, playerData.value, playerData.salary, parsedData.totalBalls, parsedData.skills));
                            }
                        } catch (parseError) {
                            if (this.logger) this.logger.log(`Error processing player ${playerId}: ${parseError.message}`, 'error');
                        }
                    },
                    (processed, total) => {
                        if (this.logger) {
                            this.logger.log(`Processing player skills: ${processed}/${total}`);
                        }
                    }
                );
                await new Promise(resolve => setTimeout(resolve, 200));
                const finalCount = this.validPlayers.size;
                if (this.logger) this.logger.log(`Search complete: found ${finalCount} players matching all criteria.`);

                if (finalCount > 0) {
                    const searchData = {
                        timestamp: new Date().toISOString(),
                        filters: JSON.parse(JSON.stringify(this.searchValues)),
                        results: Array.from(this.validPlayers.values()).map(p => p.toJSON())
                    };
                    await this.historyManager.saveSearch(searchData);
                }

                const resultsButton = document.querySelector('.nt-search-results-button');
                if (resultsButton) resultsButton.style.display = finalCount > 0 ? "inline-block" : "none";
                return Array.from(this.validPlayers.keys());
            } catch (error) {
                if (this.logger) this.logger.log(`Search error: ${error.message}`, 'error');
                alert(`An error occurred during the search: ${error.message}. Check console for details.`);
            } finally {
                if (this.logger) this.logger.flush();
            }
        }
        async performSearch() {
            if (this.isSearching) {
                if (this.logger) this.logger.log("Search already in progress.", "warn");
                return;
            }
            if (!this.searchValues.country || !this.searchValues.countryData) {
                alert("Please select a country before searching.");
                return;
            }
            this.isSearching = true;
            const internalSearchButton = document.querySelector('.nt-search-container .nt-search-button');
            if (internalSearchButton) internalSearchButton.disabled = true;
            const logContainer = document.querySelector('.nt-search-log');
            const resultsButton = document.querySelector('.nt-search-results-button');
            this.showLoading();
            if (logContainer) logContainer.innerHTML = '';
            if (resultsButton) resultsButton.style.display = 'none';
            if (!this.logger || !this.logger.container) {
                const logCont = document.querySelector('.nt-search-log');
                this.logger = logCont ? new Logger(logCont) : { log: () => {}, flush: () => {} };
            }
            try {
                await this.searchForPlayers();
            } catch (error) {
                if (this.logger) this.logger.log(`Unhandled search error: ${error.message}`, 'error');
                alert(`An unexpected error occurred: ${error.message}. Check console for details.`);
            } finally {
                this.isSearching = false;
                if (internalSearchButton) internalSearchButton.disabled = false;
                this.hideLoading();
                if (this.logger) this.logger.flush();
            }
        }
        getFiltersAppliedText(filters = this.searchValues) {
            const applied = [];
            const countryName = this.countries.find(c => c.code === filters.country)?.name || filters.country;
            if (countryName) applied.push(`Country: ${countryName}`);
            applied.push(`Age: ${filters.minAge} - ${filters.maxAge}`);
            applied.push(`Min Total Balls: ${filters.totalBalls}`);
            ORDERED_SKILL_KEYS.forEach(skill => {
                if (filters[skill] > 0) {
                    applied.push(`Min ${this.formatSkillName(skill)}: ${filters[skill]}`);
                }
            });
            return applied.join('; ');
        }
        createPaginationControls(page, totalPages) {
            const container = document.createElement('div');
            container.className = 'nt-search-results-pagination';
            if (totalPages > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'nt-search-pagination-button';
                prevBtn.textContent = 'Previous';
                prevBtn.disabled = page === 1;
                prevBtn.dataset.action = "prev";
                const pageInfo = document.createElement('span');
                pageInfo.className = 'nt-search-pagination-info';
                pageInfo.textContent = `Page ${page} of ${totalPages}`;
                const nextBtn = document.createElement('button');
                nextBtn.className = 'nt-search-pagination-button';
                nextBtn.textContent = 'Next';
                nextBtn.disabled = page === totalPages;
                nextBtn.dataset.action = "next";
                container.appendChild(prevBtn);
                container.appendChild(pageInfo);
                container.appendChild(nextBtn);
            }
            return container;
        }
        renderResultsPage(players, page) {
            const playersContainer = document.querySelector('.nt-search-players-container');
            const paginationTopContainer = document.querySelector('.nt-search-results-pagination.top');
            const paginationBottomContainer = document.querySelector('.nt-search-results-pagination.bottom');
            const modalContent = document.querySelector('.nt-search-results-content');
            if (!playersContainer || !paginationTopContainer || !paginationBottomContainer || !modalContent) return;

            this.currentResultsPage = page;
            playersContainer.textContent = '';
            paginationTopContainer.textContent = '';
            paginationBottomContainer.textContent = '';
            const playersArray = players.sort((a, b) => b.totalBalls - a.totalBalls);
            const totalPages = Math.ceil(playersArray.length / PLAYERS_PER_PAGE);
            const startIndex = (page - 1) * PLAYERS_PER_PAGE;
            const pagePlayers = playersArray.slice(startIndex, startIndex + PLAYERS_PER_PAGE);

            this.removePaginationListeners();
            this.resultsListeners.prev = () => {
                if (this.currentResultsPage > 1) {
                    this.renderResultsPage(players, this.currentResultsPage - 1);
                    if (modalContent) modalContent.scrollTop = 0;
                }
            };
            this.resultsListeners.next = () => {
                if (this.currentResultsPage < totalPages) {
                    this.renderResultsPage(players, this.currentResultsPage + 1);
                    if (modalContent) modalContent.scrollTop = 0;
                }
            };
            const topControls = this.createPaginationControls(page, totalPages);
            const bottomControls = this.createPaginationControls(page, totalPages);
            paginationTopContainer.appendChild(topControls);
            paginationBottomContainer.appendChild(bottomControls);
            this.addPaginationListeners(paginationTopContainer);
            this.addPaginationListeners(paginationBottomContainer);

            const fragment = document.createDocumentFragment();
            pagePlayers.forEach(player => {
                let skillsHTML = ORDERED_SKILL_KEYS.map(skillKey => {
                    const value = player.skills[skillKey] || 0;
                    const skillName = this.formatSkillName(skillKey);
                    return `<div class="nt-search-skill-row" title="${skillName}: ${value}"><span class="nt-search-skill-name">${skillName}</span><div class="nt-search-skill-value"><img src="/img/soccer/wlevel_${value}.gif" alt="${value}"><span class="nt-search-skill-value-text">(${value})</span></div></div>`;
                }).join('');
                const skillsContainerHTML = `<div class="nt-search-skills-list">${skillsHTML}</div>`;
                const playerCard = document.createElement('div');
                playerCard.className = 'nt-search-player-card';
                playerCard.innerHTML = `
                    <div class="nt-search-player-summary">
                        <h3 class="nt-search-player-name"><a href="https://www.managerzone.com/?p=players&pid=${player.id}" target="_blank" title="View player profile (ID: ${player.id})">${player.name}</a></h3>
                        <div class="nt-search-player-total-balls">Total Balls: <strong>${player.totalBalls}</strong></div>
                        <div class="nt-search-player-details">
                            <div>Team: ${player.teamId ? `<a href="https://www.managerzone.com/?p=team&tid=${player.teamId}" target="_blank" title="View team profile">${player.teamName}</a>` : player.teamName}</div>
                            <div>Age: ${player.age}</div>
                            <div>Value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(player.value)}</div>
                        </div>
                    </div>
                    ${skillsContainerHTML}`;
                fragment.appendChild(playerCard);
            });
            playersContainer.appendChild(fragment);
        }
        addPaginationListeners(container) {
            const prevBtn = container.querySelector('[data-action="prev"]');
            const nextBtn = container.querySelector('[data-action="next"]');
            if (prevBtn && this.resultsListeners.prev) prevBtn.addEventListener('click', this.resultsListeners.prev);
            if (nextBtn && this.resultsListeners.next) nextBtn.addEventListener('click', this.resultsListeners.next);
        }
        removePaginationListeners() {
            const containers = document.querySelectorAll('.nt-search-results-pagination');
            containers.forEach(container => {
                const prevBtn = container.querySelector('[data-action="prev"]');
                const nextBtn = container.querySelector('[data-action="next"]');
                if (prevBtn && this.resultsListeners.prev) prevBtn.removeEventListener('click', this.resultsListeners.prev);
                if (nextBtn && this.resultsListeners.next) nextBtn.removeEventListener('click', this.resultsListeners.next);
            });
        }
        showResults(players, filters = this.searchValues) {
            if (players.length === 0) {
                alert("No valid players to display.");
                return;
            }
            const existingModal = document.querySelector('.nt-search-results-modal');
            if (existingModal) existingModal.remove();

            this.removePaginationListeners();
            if (this.resultsListeners.esc) document.removeEventListener('keydown', this.resultsListeners.esc);

            const modal = document.createElement('div');
            modal.className = 'nt-search-results-modal';

            const modalHeader = document.createElement('div');
            modalHeader.className = 'nt-search-results-header';

            const headerControls = document.createElement('div');
            headerControls.className = 'nt-search-header-controls';

            const exportButtonGroup = document.createElement('div');
            exportButtonGroup.className = 'nt-search-export-button-group';

            const exportButton = document.createElement('button');
            exportButton.className = 'nt-search-export-button';
            exportButton.textContent = 'Export / Share';
            exportButton.title = 'Export or share results';

            const exportOptions = document.createElement('div');
            exportOptions.className = 'nt-search-export-options';
            exportOptions.innerHTML = `
                <button data-export-type="excel">Export to Excel (.xlsx)</button>
                <button data-export-type="html">Save as Web Page (.html)</button>
                <button data-export-type="gist">Share as Link (Gist)</button>`;

            exportButtonGroup.appendChild(exportButton);
            exportButtonGroup.appendChild(exportOptions);

            const closeButton = document.createElement('button');
            closeButton.className = 'nt-search-results-close';
            closeButton.innerHTML = '×';
            closeButton.title = 'Close Results (Esc)';

            headerControls.appendChild(exportButtonGroup);
            headerControls.appendChild(closeButton);

            modalHeader.innerHTML = `
                <div>
                    <h2 class="nt-search-results-title">Search Results (${players.length})</h2>
                    <div class="nt-search-results-filters" style="font-size: 0.8rem; color: #bbb; margin-top: 0.5rem; max-width: 700px; line-height: 1.4;">
                        <strong style="color: #ff9966;">Filters:</strong> ${this.getFiltersAppliedText(filters)}
                    </div>
                </div>`;
            modalHeader.appendChild(headerControls);

            const modalContent = document.createElement('div');
            modalContent.className = 'nt-search-results-content';
            modalContent.innerHTML = `
                <div class="nt-search-results-pagination top"></div>
                <div class="nt-search-players-container"></div>
                <div class="nt-search-results-pagination bottom"></div>`;
            modal.appendChild(modalHeader);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            this.renderResultsPage(players, 1);

            const closeModal = () => {
                this.removePaginationListeners();
                if (this.resultsListeners.esc) document.removeEventListener('keydown', this.resultsListeners.esc);
                modal.remove();
            };
            closeButton.addEventListener('click', closeModal);
            this.resultsListeners.esc = (e) => {
                if (e.key === 'Escape') closeModal();
            };
            document.addEventListener('keydown', this.resultsListeners.esc);

            exportButton.addEventListener('click', (e) => {
                e.stopPropagation();
                exportOptions.classList.toggle('show');
            });
            document.addEventListener('click', () => exportOptions.classList.remove('show'));
            exportOptions.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;
                const type = target.dataset.exportType;
                if (type === 'excel') this.exportToExcel(players);
                else if (type === 'html') this.exportToHtml(players, filters);
                else if (type === 'gist') this.shareAsGist(players, filters);
                exportOptions.classList.remove('show');
            });
        }
        formatSkillName(skill) {
            const names = { speed: 'Speed', stamina: 'Stamina', playIntelligence: 'Play Int', passing: 'Passing', shooting: 'Shooting', heading: 'Heading', keeping: 'Keeping', ballControl: 'Ball Ctrl', tackling: 'Tackling', aerialPassing: 'Aerial Pass', setPlays: 'Set Plays', experience: 'Experience' };
            return names[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
        }
        exportToExcel(players) {
            if (players.length === 0) { alert("No players to export."); return; }
            try {
                const dataToExport = players.map(player => player instanceof PlayerData ? player.toExcelRow() : new PlayerData(player.id, player.name, player.teamName, player.teamId, player.age, player.value, player.salary, player.totalBalls, player.skills).toExcelRow());
                if (dataToExport.length === 0) { alert("No data formatted for export."); return; }
                const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
                const date = new Date().toISOString().slice(0, 10);
                const countryCode = this.searchValues.country || 'export';
                XLSX.writeFile(workbook, `MZ_NT_Search_${countryCode}_${date}.xlsx`);
                if (this.logger) this.logger.log(`Exported ${dataToExport.length} players to Excel.`);
            } catch (error) {
                if (this.logger) this.logger.log(`Excel export failed: ${error.message}`, 'error');
                alert(`Excel export failed: ${error.message}. Check console for details.`);
            }
        }
        async exportHistoryToExcel() {
            if (this.logger) this.logger.log('Exporting search history...');
            const history = await this.historyManager.getHistory();
            if (history.length === 0) {
                alert("No search history found to export.");
                if (this.logger) this.logger.log('No history found.', 'warn');
                return;
            }

            try {
                const workbook = XLSX.utils.book_new();
                history.forEach((searchEntry, index) => {
                    const sheetName = new Date(searchEntry.timestamp).toISOString()
                        .slice(0, 19).replace('T', '_').replace(/:/g, '-');

                    const players = searchEntry.results.map(p => new PlayerData(p.id, p.name, p.teamName, p.teamId, p.age, p.value, p.salary, p.totalBalls, p.skills));
                    const filtersText = this.getFiltersAppliedText(searchEntry.filters);

                    const dataForSheet = players.map(p => p.toExcelRow());

                    const ws = XLSX.utils.json_to_sheet(dataForSheet, { skipHeader: false });
                    XLSX.utils.sheet_add_aoa(ws, [[`Filters: ${filtersText}`]], { origin: "A1" });
                    XLSX.utils.sheet_add_aoa(ws, [], { origin: "A2" });
                    const finalWs = XLSX.utils.json_to_sheet(dataForSheet);
                    XLSX.utils.book_append_sheet(workbook, finalWs, sheetName.slice(0, 31));
                });

                const date = new Date().toISOString().slice(0, 10);
                XLSX.writeFile(workbook, `MZ_NT_Search_History_${date}.xlsx`);
                if (this.logger) this.logger.log(`Successfully exported ${history.length} searches to Excel.`);

            } catch (error) {
                if (this.logger) this.logger.log(`History export failed: ${error.message}`, 'error');
                alert(`History export failed: ${error.message}.`);
            }
        }
        exportToHtml(players, filters) {
            const filtersText = this.getFiltersAppliedText(filters).replace(/;/g, '<br>');
            const rows = players.map(p => {
                const skills = ORDERED_SKILL_KEYS.map(key => `<td>${p.skills[key] || 0}</td>`).join('');
                return `<tr><td><a href="https://www.managerzone.com/?p=players&pid=${p.id}" target="_blank">${p.name}</a></td><td>${p.age}</td><td>${p.totalBalls}</td>${skills}</tr>`;
            }).join('');
            const headerCells = ORDERED_SKILL_KEYS.map(key => `<th>${this.formatSkillName(key)}</th>`).join('');
            const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>MZ Player Search Results</title><style>body{font-family:sans-serif;background-color:#1a1a2e;color:#f0f0f0;padding:2rem}h1,h2{color:violet}a{color:#ff9966}table{width:100%;border-collapse:collapse;margin-top:1rem}th,td{padding:8px 12px;border:1px solid #333}th{background-color:#2a2a4e}tr:nth-child(even){background-color:#222}</style></head><body><h1>MZ Player Search Results</h1><h2>Filters Applied:</h2><p>${filtersText}</p><table><thead><tr><th>Name</th><th>Age</th><th>Total Balls</th>${headerCells}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().slice(0, 10);
            const countryCode = this.searchValues.country || 'export';
            a.href = url;
            a.download = `MZ_NT_Search_${countryCode}_${date}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (this.logger) this.logger.log(`Exported ${players.length} players to HTML.`);
        }
        async shareAsGist(players, filters) {
            const filtersText = this.getFiltersAppliedText(filters).replace(/; /g, '\n- ');
            const header = `| Name | Age | Total Balls | ${ORDERED_SKILL_KEYS.map(k => this.formatSkillName(k)).join(' | ')} |`;
            const separator = `|---|---|---|${ORDERED_SKILL_KEYS.map(() => '---').join('|')}|`;
            const rows = players.map(p => {
                const skills = ORDERED_SKILL_KEYS.map(key => p.skills[key] || 0).join(' | ');
                return `| [${p.name}](https://www.managerzone.com/?p=players&pid=${p.id}) | ${p.age} | ${p.totalBalls} | ${skills} |`;
            }).join('\n');
            const markdownContent = `## MZ Player Search Results\n\n### Filters:\n- ${filtersText}\n\n${header}\n${separator}\n${rows}`;
            this.showLoading();
            if (this.logger) this.logger.log('Creating Gist...');
            try {
                const gistOnlyPat = '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';
                const countryCode = filters.country || 'export';
                const date = new Date().toISOString().slice(0, 10);
                const fileName = `MZ-Search-${countryCode}-${date}.md`;
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.github.com/gists',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/vnd.github.v3+json',
                            'Authorization': `token ${gistOnlyPat}`
                        },
                        data: JSON.stringify({
                            description: `MZ NT Player Search Results - ${new Date().toLocaleString()}`,
                            public: true,
                            files: { [fileName]: { content: markdownContent } }
                        }),
                        onload: res => resolve(res),
                        onerror: err => reject(err),
                        ontimeout: () => reject(new Error('Gist creation timed out.'))
                    });
                });
                if (response.status >= 200 && response.status < 300) {
                    const gist = JSON.parse(response.responseText);
                    prompt('Shareable link:', gist.html_url);
                    if (this.logger) this.logger.log('Gist created successfully.');
                } else {
                    let errorDetails = response.responseText;
                    try {
                        const errorJson = JSON.parse(response.responseText);
                        errorDetails = `(${response.status}) ${errorJson.message || 'Unknown error'}. See documentation link for details.`;
                    } catch (e) {
                       errorDetails = `(${response.status}) ${response.statusText}`;
                    }
                    throw new Error(errorDetails);
                }
            } catch (error) {
                if (this.logger) this.logger.log(`Gist creation failed: ${error.message}`, 'error');
                alert(`Gist creation failed. This may be due to an invalid token or GitHub's rate limits. Please try again later. Error: ${error.message}`);
            } finally {
                this.hideLoading();
            }
        }
        appendSearchTab() {
            const existingFab = document.querySelector('.nt-search-fab');
            if (existingFab) existingFab.remove();
            const existingContainer = document.querySelector('.nt-search-container');
            if (existingContainer) existingContainer.remove();

            this.floatingButton = document.createElement('div');
            this.floatingButton.className = 'nt-search-fab';
            this.floatingButton.innerHTML = '<i class="fa fa-search"></i>';
            this.floatingButton.title = 'Open NT Player Search';
            document.body.appendChild(this.floatingButton);

            const searchContainer = document.createElement('div');
            searchContainer.className = 'nt-search-container';
            const goText = 'Search';
            const skillsHTML = ORDERED_SKILL_KEYS.map(key => {
                const label = this.formatSkillName(key);
                return `
                <div class="nt-search-field">
                    <label title="Minimum ${label}">${label}</label>
                    <select name="${key}" title="Select minimum ${label}" disabled>
                        ${this.generateOptions(10, 0, key)}
                    </select>
                </div>`;
            }).join('');

            searchContainer.innerHTML = `
                <div class="nt-search-header">
                    <h2>NT Player Search</h2>
                    <div class="nt-search-history-controls">
                        <button class="nt-search-history-button" title="View search history">History</button>
                        <button class="nt-search-results-close" title="Close Panel (Esc)" style="font-size: 1.2rem; padding: 0.3rem 0.6rem;">×</button>
                    </div>
                </div>
                <div class="nt-search-grid">
                    ${skillsHTML}
                    <div class="nt-search-field"><label title="Minimum Total Balls">Total Balls</label><select name="totalBalls" title="Select minimum Total Balls" disabled>${this.generateOptions(110, 9, 'totalBalls')}</select></div>
                    <div class="nt-search-field"><label title="Minimum Age">Min Age</label><select name="minAge" title="Select minimum Age" disabled>${this.generateOptions(96, 16, 'minAge')}</select></div>
                    <div class="nt-search-field"><label title="Maximum Age">Max Age</label><select name="maxAge" title="Select maximum Age" disabled>${this.generateOptions(96, 16, 'maxAge')}</select></div>
                    <div class="nt-search-country-select nt-search-field"><label>Country</label><select name="country" required title="Select country (only your country is enabled)" disabled><option value="" disabled selected>Loading countries...</option></select></div>
                </div>
                <div class="nt-search-buttons">
                    <button class="nt-search-button" title="Start searching" disabled>${goText}</button>
                    <button class="nt-search-results-button" style="display: none;" title="Show found players">Show Results</button>
                </div>
                <div class="nt-search-log" title="Search process log"></div>`;
            document.body.appendChild(searchContainer);
            this.logger = new Logger(searchContainer.querySelector('.nt-search-log'));
        }
        generateCountryOptions() {
            if (!this.countries || this.countries.length === 0) return `<option value="" disabled selected>Error loading countries</option>`;
            const placeholder = `<option value="" disabled ${!this.userCountry ? 'selected' : ''}>Select your country</option>`;
            return placeholder + this.countries.sort((a, b) => a.name.localeCompare(b.name)).map(country => {
                const isUserCountry = country.code === this.userCountry;
                const displayName = country.name === 'Czech Republic' ? 'Czechia' : country.name === 'Macedonia' ? 'North Macedonia' : country.name;
                return `<option value="${country.code}" data-ntid="${country.ntid}" data-u21ntid="${country.u21ntid}" data-cid="${country.cid}" ${isUserCountry ? 'selected' : ''} ${!isUserCountry ? 'disabled' : ''}>${displayName}</option>`;
            }).join('');
        }
        generateOptions(max, min = 0, name) {
            let optionsHTML = '';
            const defaultValue = this.searchValues[name];
            for (let i = min; i <= max; i++) {
                optionsHTML += `<option value="${i}" ${defaultValue === i ? 'selected' : ''}>${i}</option>`;
            }
            return optionsHTML;
        }
        handleSelectChange(e) {
            const select = e.target;
            const value = select.value;
            if (select.name === 'country') {
                const option = select.selectedOptions[0];
                if (option && option.value) {
                    this.searchValues.country = value;
                    this.searchValues.countryData = { ntid: option.dataset.ntid, u21ntid: option.dataset.u21ntid, cid: option.dataset.cid };
                    if (this.logger) this.logger.log(`Country set to: ${option.textContent.trim()}`);
                } else {
                    this.searchValues.country = '';
                    this.searchValues.countryData = null;
                    if (this.logger) this.logger.log(`Country selection cleared.`, 'warn');
                }
            } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue)) {
                    this.searchValues[select.name] = numValue;
                    if (select.name === 'minAge' && numValue > this.searchValues.maxAge) {
                        this.searchValues.maxAge = numValue;
                        const maxAgeSelect = document.querySelector('select[name="maxAge"]');
                        if (maxAgeSelect) maxAgeSelect.value = numValue;
                    } else if (select.name === 'maxAge' && numValue < this.searchValues.minAge) {
                        this.searchValues.minAge = numValue;
                        const minAgeSelect = document.querySelector('select[name="minAge"]');
                        if (minAgeSelect) minAgeSelect.value = numValue;
                    }
                }
            }
        }
        async showHistoryModal() {
            const history = await this.historyManager.getHistory();
            const existingModal = document.querySelector('.nt-search-history-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.className = 'nt-search-history-modal';

            let listContentHTML;
            if (history.length === 0) {
                listContentHTML = '<div class="nt-search-history-empty">No search history found.</div>';
            } else {
                listContentHTML = `<ul class="nt-search-history-list">` + history.map(entry => {
                    const date = new Date(entry.timestamp);
                    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                    const filtersText = this.getFiltersAppliedText(entry.filters);

                    return `
                        <li class="nt-search-history-item" data-timestamp="${entry.timestamp}">
                            <div class="nt-search-history-item-info">
                                <span class="nt-search-history-item-timestamp">${formattedDate}</span>
                                <span class="nt-search-history-item-filters" title="${filtersText}">${filtersText}</span>
                            </div>
                            <div class="nt-search-history-item-actions">
                                <button class="nt-search-button" data-action="view-history" title="View these results">View</button>
                                <button class="nt-search-button delete" data-action="delete-history" title="Delete this entry">Delete</button>
                            </div>
                        </li>
                    `;
                }).join('') + '</ul>';
            }

            modal.innerHTML = `
                <div class="nt-search-history-header">
                    <h2 class="nt-search-history-title">Search History</h2>
                    <div class="nt-search-history-header-actions">
                         <button class="nt-search-history-button" id="history-export-btn" title="Export all saved searches to Excel">Export History</button>
                         <button class="nt-search-results-close" title="Close History (Esc)">×</button>
                    </div>
                </div>
                <div class="nt-search-history-content">
                    ${listContentHTML}
                </div>
            `;

            document.body.appendChild(modal);

            const closeModal = () => {
                modal.remove();
                document.removeEventListener('keydown', keydownHandler);
            };

            const keydownHandler = (e) => {
                if (e.key === 'Escape') closeModal();
            };

            modal.querySelector('.nt-search-results-close').addEventListener('click', closeModal);
            document.addEventListener('keydown', keydownHandler);

            modal.querySelector('#history-export-btn')?.addEventListener('click', () => {
                 this.exportHistoryToExcel();
            });

            modal.querySelector('.nt-search-history-list')?.addEventListener('click', async (e) => {
                const target = e.target;
                const action = target.dataset.action;
                const item = target.closest('.nt-search-history-item');
                if (!action || !item) return;

                const timestamp = item.dataset.timestamp;
                const historyEntry = history.find(entry => entry.timestamp === timestamp);

                if (action === 'view-history') {
                    if (!historyEntry) return;
                    const players = historyEntry.results.map(p => new PlayerData(p.id, p.name, p.teamName, p.teamId, p.age, p.value, p.salary, p.totalBalls, p.skills));
                    this.showResults(players, historyEntry.filters);
                    closeModal();
                } else if (action === 'delete-history') {
                    await this.historyManager.deleteSearch(timestamp);
                    item.remove();
                    if (modal.querySelectorAll('.nt-search-history-item').length === 0) {
                        modal.querySelector('.nt-search-history-content').innerHTML = '<div class="nt-search-history-empty">No search history found.</div>';
                    }
                }
            });
        }
        setUpEvents() {
            const searchContainer = document.querySelector('.nt-search-container');
            if (!searchContainer || !this.floatingButton) return;

            const internalSearchButton = searchContainer.querySelector('.nt-search-button');
            const resultsButton = searchContainer.querySelector('.nt-search-results-button');
            const selects = searchContainer.querySelectorAll('select');
            const closeButton = searchContainer.querySelector('.nt-search-results-close');
            const historyButton = searchContainer.querySelector('.nt-search-history-button');

            this.floatingButton.addEventListener('click', (e) => {
                e.preventDefault();
                searchContainer.classList.toggle('visible');
                if (searchContainer.classList.contains('visible') && !this.isInitialized && !this.isInitializing) {
                    this.firstThingsFirst();
                }
            });

            if (closeButton) closeButton.addEventListener('click', () => searchContainer.classList.remove('visible'));
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchContainer.classList.contains('visible') && !document.querySelector('.nt-search-history-modal') && !document.querySelector('.nt-search-results-modal')) {
                    searchContainer.classList.remove('visible');
                }
            });

            selects.forEach(select => select.addEventListener('change', (e) => this.handleSelectChange(e)));
            if (historyButton) historyButton.addEventListener('click', () => this.showHistoryModal());
            if (internalSearchButton) internalSearchButton.addEventListener('click', () => this.performSearch());
            if (resultsButton) resultsButton.addEventListener('click', () => this.showResults(Array.from(this.validPlayers.values())));
        }
    }
    try {
        const searcher = new NTPlayerSearcher();
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            searcher.initialize();
        } else {
            document.addEventListener('DOMContentLoaded', () => searcher.initialize());
        }
    } catch (e) {
        alert("Failed to initialize NTPlayerSearch. Check the console for details.");
    }
})();