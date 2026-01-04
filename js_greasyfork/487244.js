// ==UserScript==
// @name               gm-import-export
// @description        Helper functions for importing and exporting stored values.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// ==/UserScript==

function GM_importValues(values, cleanImport = false)
{
    if (cleanImport)
    {
        for (const key of GM_listValues())
        {
            GM_deleteValue(key);
        }
    }

    for (const key of Object.keys(values))
    {
        GM_setValue(key, values[key]);
    }
}

function GM_exportValues()
{
    const values = {};
    for (const key of GM_listValues())
    {
        values[key] = GM_getValue(key);
    }

    return values;
}

GM.importValues = async function importValues(values, cleanImport = false)
{
    if (cleanImport)
    {
        const promises = [];
        for (const key of await GM.listValues())
        {
            promises.push(GM.deleteValue(key));
        }

        await Promise.all(promises);
    }

    const promises = [];
    for (const key of Object.keys(values))
    {
        promises.push(GM.setValue(key, values[key]));
    }

    await Promise.all(promises);
}

GM.exportValues = async function exportValues()
{
    const keys = await GM.listValues();

    const promises = [];
    for (const key of keys)
    {
        promises.push(GM.getValue(key));
    }

    const values = await Promise.all(promises);
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
}
