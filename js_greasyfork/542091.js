// ==UserScript==
// @name            Suppress illegal page transition
// @name:ja         不正なページ遷移抑制
// @namespace       https://furyutei.com/
// @license         MIT
// @version         0.0.2
// @description     Suppress page transitions when pressing the "Add to List" button in preparation
// @description:ja  準備完了前に[リストに追加]ボタンを押すと不正なページ遷移が発生してしまう不具合を抑制
// @author          furyu@fuyutei.com
// @match           https://www.amazon.co.jp/dp/*
// @match           https://www.amazon.co.jp/*/dp/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant           none
// @run-at          document-start
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/amzSuppressIllegalPageTransition/issues
// @contributionURL https://memo.furyutei.com/about#send_donation
// @downloadURL https://update.greasyfork.org/scripts/542091/Suppress%20illegal%20page%20transition.user.js
// @updateURL https://update.greasyfork.org/scripts/542091/Suppress%20illegal%20page%20transition.meta.js
// ==/UserScript==

(() => {
    'use strict';
    
    const SCRIPT_NAME = 'amzSuppressIllegalPageTransition';
    
    class WishlistController {
        #script_name = 'user_content_script';
        #css_style_id = 0;
        #hide_buttons_css_style = null;
        
        constructor(script_name = null) {
            if (script_name) {
                this.#script_name = script_name;
            }
        }
        
        hide_buttons() {
            this.#insert_hide_buttons_css_style();
            return this;
        }
        
        show_buttons() {
            this.#remove_hide_buttons_css_style();
            return this;
        }
        
        patch_buttons() {
            // [備忘] [リストに追加]関連ボタンが、もともとtype="submit"になっており、早いタイミングで押すと不正な遷移をしてしまうのはこれが原因
            // →type="button"に変更することで防止することが可能
            [... document.querySelectorAll('#add-to-wishlist-button-submit,#add-to-wishlist-button')].forEach(button => {
                if (button.type == 'submit') {
                    button.type = 'button';
                }
            });
            return this;
        }
        
        #insert_css(css_rule_text) {
            const css_style = document.createElement('style');
            const css_rule = document.createTextNode(css_rule_text);
            
            css_style.id = `${this.script_name}-css-${++ this.#css_style_id}`;
            css_style.type = 'text/css';
            css_style.append(css_rule);
            document.documentElement.append(css_style);
            return css_style;
        }
        
        #insert_hide_buttons_css_style() {
            this.#remove_hide_buttons_css_style();
            this.#hide_buttons_css_style = this.#insert_css(`
                #wishlistButtonStack {
                    visibility: hidden;
                }
            `);
        }
        
        #remove_hide_buttons_css_style() {
            if (! this.#hide_buttons_css_style) {
                return;
            }
            this.#hide_buttons_css_style.remove();
            this.#hide_buttons_css_style = null;
        }
    }

    class Main {
        #script_name = 'user_content_script';
        #wishlist_controller = null;
        #monitor_script = null;
        #observer = null;
        
        constructor(script_name = null) {
            const self_object = this;
            
            if (script_name) {
                this.#script_name = script_name;
            }
            script_name = this.#script_name;
            
            this.#wishlist_controller = new WishlistController(script_name).hide_buttons();
            
            this.#monitor_script = (() => {
                // [備忘] addEventListener()関数の呼び出しを監視し、[リストに追加]ボタンにclickイベントが設定されるのを待つ処理をインラインスクリプトとして埋め込み
                // ※clickイベント設定時には当該scriptのdata-eventset属性が"false"→"true"になる
                //
                // [TODO] 目的の要素に対してaddEventListener()以外の手段でイベントが設定されているケースには未対応
                // ※最初はフェイルセーフとしてDOMContentLoadedイベント時にも完了とみなすようにしていたが、どうもDOMContentLoaded後にclickイベントが設定されるケースもある模様(Firefoxで確認)
                // →とりあえずloadイベント発生までは待ってみるようにして様子見
                const script_id = `${script_name}-watch-script`;
                const script = document.createElement('script');
                
                script.dataset.eventset = false;
                script.id = script_id;
                script.textContent = `
                    (() => {
                        'use strict';
                        EventTarget.prototype.original_addEventListener = EventTarget.prototype.addEventListener;
                        const restore_method = event => {
                            if (event !== undefined) {
                                console.warn('[${script_name}] "load" event occurred before "click" handler was set.');
                            }
                            //document.removeEventListener('DOMContentLoaded', restore_method);
                            document.removeEventListener('load', restore_method);
                            EventTarget.prototype.addEventListener = EventTarget.prototype.original_addEventListener;
                            delete EventTarget.prototype.original_addEventListener;
                            document.querySelector('#${script_id}').dataset.eventset = true;
                        };
                        EventTarget.prototype.addEventListener = function (type, listener, options) {
                            this.original_addEventListener(type, listener, options);
                            if ((this.id == 'add-to-wishlist-button-submit') && (type == 'click')) {
                                restore_method();
                            }
                        };
                        //document.addEventListener('DOMContentLoaded', restore_method);
                        document.addEventListener('load', restore_method);
                    })();
                `;
                document.documentElement.append(script);
                return script;
            })();
            
            //this.finish = this.finish.bind(this);
            // [備忘] 
            // document.addEventListener('DOMContentLoaded', this.finish);
            // のようにするイベントハンドラとしてメソッド(finish)を指定する場合には
            // - あらかじめthisをbindしておかないと、Firefoxでイベントハンドラが呼ばれた際にエラーが発生してしまう
            // - finishを#finish(private)のようにしてしまうとbindに失敗してしまう
            
            this.#observer = new MutationObserver(records => {
                self_object.#stop_observe();
                if (self_object.#monitor_script.dataset.eventset == 'true') {
                    self_object.#finish();
                    return;
                }
                self_object.#start_observe();
            });
            
            this.#start_observe();
        }
        
        #start_observe() {
            this.#observer.observe(this.#monitor_script, {
                attributes: true,
                childList: false,
                subtree: false
            });
        }
        
        #stop_observe() {
            this.#observer.disconnect();
        }
        
        #finish(event) {
            this.#stop_observe();
            this.#observer = null;
            this.#wishlist_controller
                .patch_buttons()
                .show_buttons();
            this.#monitor_script.remove();
            this.#monitor_script = null;
            this.#wishlist_controller = null;
        }
    }
    
    new Main(SCRIPT_NAME);
})();
