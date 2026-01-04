
const cfg = {};
(() => {
'use strict';

const config = {};

const inplace = (() => {
    const id = "test";
    try{
        const cap = GM_registerMenuCommand("测试", Function.prototype, {id});
        GM_unregisterMenuCommand(cap);
        return (cap === id);
    } catch(e) {return false;}
})();

const tmpu = {};

const register = (() => {
    const boolean_prefix = ["❌(已禁用) ", "✅(已启用) "];
    const int_family = ['uint', 'int'];
    return ({name, default: def, type = "other", desc: prompts, tips: ipt, input: func = prompt, callback: listener = Function.prototype, init = false, autoClose = true, judge: _jud, temp = false}) => {
        // let val = GM_getValue(name, def);
        // config[name] = val;
        const judge = (() => {
            if (typeof _jud === 'function') return _jud;
            return () => true;
        })();
        if (!temp) Object.defineProperty(config, name, {
            get: () => GM_getValue(name, def),
            set: val => GM_setValue(name, val)
        });
        else tmpu[name] = def;
        if (typeof init === 'function') init(name, config[name]);
        if (int_family.includes(type)) {
            const judge = (type === 'uint') ? (s => (s|0) < 0) : (()=>false);
            if (func === prompt) {
                func = () => {
                    let p;
                    do {p = prompt(ipt, config[name]);} while(isNaN(p) || judge(p));
                    return p | 0;
                };
            }
            type = 'other';
        }
        const cfg = {id: name, autoClose};
        if (type === 'bool') {
            let cont;
            const reg = () => cont = GM_registerMenuCommand(boolean_prefix[config[name] | 0] + prompts, () => {
                const newval = !config[name];
                if (judge(name, newval))
                    config[name] = newval;
            }, cfg);
            if (true == init) listener(name, config[name], config[name], cont);
            const stn = (() => {
                const re_reg = inplace ? reg : () => (GM_unregisterMenuCommand(cont), reg());
                return (_1, ov, nv) => (reg(), listener(name, ov, nv, cont));
            })();
            if (!temp) GM_addValueChangeListener(name, stn);
            else Object.defineProperty(config, name, {
                get: () => tmpu[name],
                set: v => (stn(name, tmpu[name], v), tmpu[name] = v),
            });
            reg();
        } else if (type === "other") {
            if (func === prompt) func = () => prompt(ipt, config[name]);
            const cont = GM_registerMenuCommand(prompts, () => {
                const inp = func();
                if (judge(name, inp))
                    GM_setValue(name, inp);
            }, cfg);
            if (true == init) listener(name, config[name], config[name], cont);
            if (!temp) GM_addValueChangeListener(name, (_1, ov, nv) => listener(name, ov, nv, cont));
            else Object.defineProperty(config, name, {
                get: () => tmpu[name],
                set: v => (listener(name, tmpu[name], v, cont), tmpu[name] = v),
            });
        }
        console.debug(name, "in type", type, "\nRegistered!");
    };
})();

cfg.config = config;
cfg.register = register;
})();