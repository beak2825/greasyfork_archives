// ==UserScript==
// @name        UserscriptSettings
// @description none
// @version     1.0.1
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

const UserscriptSettings = (function () {
    const settingsDefinition = {};

    function get(settingKey) {
        const storedSettings = GM_getValue("settings", {});
        if (settingKey in storedSettings) return storedSettings[settingKey];
        return settingsDefinition[settingKey]?.default;
    }

    function set(settingKey, rawValue) {
        const def = settingsDefinition[settingKey];
        let value = rawValue;

        try {

            if (typeof def.validator === "function" && !def.validator(value))
                return alert(`Invalid value for ${def.name}`);

            if (typeof def.formatter === "function")
                value = def.formatter(rawValue);

        } catch (e) {
            console.warn(`Error for setting "${settingKey}":`, e);
            return;
        }
        const storedSettings = GM_getValue("settings", {});
        storedSettings[settingKey] = value;
        GM_setValue("settings", storedSettings);

        location.reload();
    }

    function define(settingsObj) {
        for (const [key, def] of Object.entries(settingsObj)) {
            if (def && def.default !== undefined) {
                settingsDefinition[key] = def;
            }
        }
    }

    function createMenu() {
        const storedSettings = GM_getValue("settings", {});
        for (const [key, setting] of Object.entries(settingsDefinition)) {
            const currentValue = key in storedSettings ? storedSettings[key] : setting.default;

            const title = typeof setting.default === "boolean" && !setting?.onclick
            ? () => `${get(key) ? "✔️" : "❌"} ${setting.name}`
            : typeof setting.name === "function" ? setting.name(currentValue) : setting.name;

            const handler = () => {
                if (typeof setting.onclick === "function") {
                    setting.onclick(currentValue, (newValue) => set(key, newValue));
                } else if (typeof setting.default === "boolean") {
                    set(key, !currentValue);
                } else {
                    const shownValue = setting.display ? setting.display(currentValue) : String(currentValue);
                    const input = prompt(setting.name, shownValue);
                    if (input !== null) {
                        const parsedValue = typeof setting.default === "number" ? Number(input) : input;
                        set(key, parsedValue);
                    }
                }
            };

            GM_registerMenuCommand(
                typeof title === 'function' ? title() : title,
                handler
            );
        }
    }
    
    return {
        define,
        get,
        set,
        createMenu,
    };
})();