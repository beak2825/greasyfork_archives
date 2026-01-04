// ==UserScript==
// @name         GMX_menu
// @namespace    https://greasyfork.org/users/1001518
// @version      0.1.1
// @description  A simple userscript menu manager, treats all menu items as a GMX_menu object.
// @author       DianaBlessU
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

class GMX_Menu{

    items = [];
    item_ids = [];
    auto_refresh = true;

    constructor(options) {
        if (options) this.install(options)
    }

    install(options){
        if (options){
            this.auto_refresh = options.autoRefresh ?? true;
            this.items = options.items ?? [];
            this.refresh();
        }
    }

    uninstall(){
        this.items = [];
        this.refresh();
    }

    refresh(){
        this.item_ids.forEach(id => GM_unregisterMenuCommand(id));
        this.item_ids = [];
        this.items.forEach(item => {
            if (item.separator){
                let item_str = "➖➖➖➖➖➖➖➖➖➖"
                this.item_ids.push(GM_registerMenuCommand(item_str))
            }else{
                let item_str = (item.checked==null) ? `${item.text}` : `${item.checked ? '✅':'🟩'} ${item.text}`
                this.item_ids.push(GM_registerMenuCommand(item_str, event => this.triggerSelect(item.name, event)));
            }
        })
    }

    getItem(name){
        return this.items.filter(item => item.name == name)[0] 
    }

    renderSelect(name){
        let item = this.getItem(name);
        if (!item) throw new ReferenceError(`No items named '${name}'`)
        let refresh_needed = false;
        if (item.checked != null){
            if (item.group != null && item.checked == false){
                this.items.forEach(co_item => {
                    if (co_item.group == item.group) co_item.checked = false
                })
                item.checked = true;
                refresh_needed = true;
            } else if (item.group == null) {
                item.checked = !item.checked;
                refresh_needed = true;
            }
        }
        if (refresh_needed && this.auto_refresh) {
            this.refresh();
        }
        return item.checked
    }

    triggerSelect(name, event){
        let item = this.getItem(name);
        if (!item) throw new ReferenceError(`No items named '${name}'`)
        this.renderSelect(name);
        item.callback(event);
    }

    setText(name, text) {
        let item = this.getItem(name);
        if (!item) throw new ReferenceError(`No items named '${name}'`)
        item.text = text;
        if (this.auto_refresh){
            this.refresh();
        }
    }

    isChecked(name){
        let item = this.getItem(name);
        if (!item) throw new ReferenceError(`No items named '${name}'`)
        return item.checked;
    }

}

window.GMX_menu = new GMX_Menu();
