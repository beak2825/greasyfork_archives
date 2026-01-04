// ==UserScript==
// @name         下拉选择框改善用户体验
// @name:en      Drop Down Select Box Improves User Experience
// @name:zh-CN   下拉选择框改善用户体验
// @name:zh-TW   下拉選單改善使用者體驗
// @name:ja      ドロップダウン選択ボックスがユーザーエクスペリエンスを向上させる
// @name:ko      드롭다운 선택 상자로 사용자 경험 개선
// @name:de      Verbessertes Benutzererlebnis mit Dropdown-Auswahlfeld
// @name:fr      Amélioration de l'expérience utilisateur avec une liste déroulante
// @name:es      Mejora de la experiencia del usuario con cuadro de selección desplegable
// @name:pt      Melhorando a experiência do usuário com caixa de seleção suspensa
// @name:ru      Улучшенный пользовательский опыт с выпадающим списком
// @name:it      Miglioramento dell'esperienza utente con casella di selezione a discesa
// @name:tr      Aşağı açılır seçim kutusuyla kullanıcı deneyimini geliştirme
// @name:ar      تحسين تجربة المستخدم باستخدام خيارات مربع الاختيار القابل للسحب
// @name:th      การปรับปรุงประสบการณ์ของผู้ใช้ด้วยกล่องเลือกแบบเลื่อนลง
// @name:vi      Cải thiện trải nghiệm người dùng với hộp thả xuống lựa chọn
// @name:id      Meningkatkan Pengalaman Pengguna dengan Kotak Pilihan Drop Down
// @namespace   Violentmonkey Scripts
// @match        *://*/*
// @grant       none
// @version     XiaoYing_2023.07.18.7
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @description 为网页上的下拉选择框添加更好的用户体验 弹出式搜索进行选择
// @description:en Add a better user experience for dropdown select boxes on webpages Popup search for selection
// @description:zh-CN 为网页上的下拉选择框添加更好的用户体验 弹出式搜索进行选择
// @description:zh-TW 為網頁上的下拉選擇框添加更好的用戶體驗 彈出式搜索進行選擇
// @description:ja ドロップダウンセレクトボックスのより良いユーザーエクスペリエンスを提供するためのスクリプト ポップアップ検索による選択
// @description:ko 웹 페이지의 드롭다운 선택 상자에 더 나은 사용자 경험 제공 팝업 검색으로 선택
// @description:de Besseres Benutzererlebnis für Dropdown-Auswahlfelder auf Webseiten Popup-Suche zur Auswahl
// @description:fr Améliorez l'expérience utilisateur des menus déroulants sur les pages Web Recherche contextuelle pour la sélection
// @description:es Mejore la experiencia del usuario en los cuadros de selección desplegables en las páginas web Búsqueda emergente para la selección
// @description:pt Adicione uma melhor experiência do usuário para caixas de seleção suspensas em páginas da web Pesquisa de pop-up para seleção
// @description:ru Добавить более удобный пользовательский интерфейс для выпадающих списков на веб-страницах Всплывающий поиск для выбора
// @description:it Aggiungi una migliore esperienza utente per le caselle di selezione a discesa nelle pagine web Ricerca popup per la selezione
// @description:tr Web sayfalarındaki açılır menüler için daha iyi bir kullanıcı deneyimi ekleyin Seçim için açılır arama
// @description:ar أضف تجربة مستخدم أفضل لصناديق الاختيار القابلة للسحب على صفحات الويب بحث منبثق للاختيار
// @description:th เพิ่มประสบการณ์การใช้งานที่ดีขึ้นสำหรับกล่องเลือกที่เหลือบนหน้าเว็บค้นหาโดยกระทำสำหรับการเลือก
// @description:vi Thêm trải nghiệm người dùng tốt hơn cho hộp thả xuống trên các trang web Tìm kiếm xuất hiện cho việc chọn lựa
// @description:id Tambahkan pengalaman pengguna yang lebih baik untuk kotak pilihan drop-down di halaman web Pencarian pop-up untuk pemilihan
// @downloadURL https://update.greasyfork.org/scripts/471079/%E4%B8%8B%E6%8B%89%E9%80%89%E6%8B%A9%E6%A1%86%E6%94%B9%E5%96%84%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/471079/%E4%B8%8B%E6%8B%89%E9%80%89%E6%8B%A9%E6%A1%86%E6%94%B9%E5%96%84%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

var global_module = window['global_module'];
var globalVariable = new Map();

(async () => {
    function showModal() {
        let ModalDom = $(`<div id="_select_"><div id="_selectModal_grayMask_"></div><div id="_selectModal_">
            <input type="text" class="input-box">
            <div class="content">
                <div class="list">
                </div>
            </div>
        </div></div>`);
        globalVariable.set('ModalDom', ModalDom);
        $('body').append(ModalDom);
        ModalDom.find('.input-box').eq(0).focus();
        ModalDom.find('div[id="_selectModal_grayMask_"]').on('click', function () {
            closeModal();
        });
        return ModalDom;
    }

    function addOption(ModalDom, listDomOrStr = null) {
        if (!listDomOrStr) {
            return;
        }
        let listDom = ModalDom.find('div.list').eq(0);
        listDom.append(listDomOrStr);
    }

    function closeModal() {
        let modalDom = globalVariable.get('ModalDom');
        modalDom.remove();
        globalVariable.delete('ModalDom');
    }

    function initCss() {
        if (globalVariable.get('pageCss')) {
            return;
        }
        let css = `
            #_selectModal_grayMask_ {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }

            #_selectModal_ {
                position: fixed;
                width: 90%;
                height: 90%;
                background-color: White;
                top: 5%;
                left: 5%;
                z-index: 10000;
            }

            .input-box {
                width: 100%;
                height: 50px;
                box-sizing: border-box;
                padding: 10px;
                font-size: 16px;
                border-radius: 5px;
                border: 2px solid #3438b9;
                outline: none;
            }
            
            .content {
                height: calc(100% - 60px);
                overflow-y: auto;
            }
            
            .list li{
                list-style: none;
                text-align: center;
                border-radius: 5px;
                border: 1px solid #3438b9;
                line-height: 36px;
                margin-top: 8px;
                margin-right: 10px;
                margin-left: 10px;
                cursor: pointer;
            }
            
            @media screen and (min-width: 768px) {
                .list {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 1px;
                }
            }
            @media screen and (max-width: 767px) {
                .list {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1px;
                }
            }
        `;
        globalVariable.set('pageCss', css);
        $('body').append('<style id="selectPageCss">' + css + '</style>');
    }

    globalVariable.set('selectSed', 0);

    function findSelect() {
        let select = $('select');
        for (let i = 0; i < select.length; i++) {
            let sed = parseInt(globalVariable.get('selectSed').toString());
            globalVariable.set('selectSed', sed + 1);
            let obj = select[i];
            obj.setAttribute('sed', sed);
            (async (that = obj) => {
                that.addEventListener('click', () => {
                    let ModalDom = showModal();
                    let listDomOrStr = '';
                    let options = that.options;
                    for (let i = 0; i < options.length; i++) {
                        listDomOrStr += `<li onclick="_selectModal_Click_(this,${sed});" index='${i}'>${options[i].innerHTML}</li>`;
                    }
                    addOption(ModalDom, listDomOrStr);
                    ModalDom.find('.input-box')
                        .eq(0)
                        .on(
                            'input',
                            global_module.debounce((e) => {
                                let val = e.target.value;
                                let ops = ModalDom.find('div.list').eq(0).find('li');
                                for (let i = 0; i < ops.length; i++) {
                                    let op = ops[i];
                                    if (val !== '') {
                                        if (op.innerHTML.indexOf(val) === -1) {
                                            op.style.display = 'none';
                                        } else {
                                            op.style.display = 'block';
                                        }
                                    } else {
                                        op.style.display = 'block';
                                    }
                                }
                            }, 200)
                        );
                    initCss();
                });
            })();
        }
    }

    function selectModalClick(that, sed) {
        closeModal();
        let index = that.getAttribute('index');
        index = parseInt(index);
        let select = $('select[sed=' + sed + ']').eq(0);
        select.prop('selectedIndex', index);
        select[0].focus();
        select[0].dispatchEvent(new Event('change'));
    }

    unsafeWindow['_selectModal_Click_'] = selectModalClick;

    function main() {
        findSelect();
    }

    $(document).ready(() => {
        main();
    });
})();
