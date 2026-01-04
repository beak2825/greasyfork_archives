// ==UserScript==
// @name         URL Replacer/Redirector
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      2.0
// @description  Redirect specific sites by replacing part of the URL.
// @author       Gavin Borg
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @match        https://greasyfork.org/en/scripts/403100-url-replacer-redirector
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/403100/URL%20ReplacerRedirector.user.js
// @updateURL https://update.greasyfork.org/scripts/403100/URL%20ReplacerRedirector.meta.js
// ==/UserScript==

// Grant GM_*value for legacy Greasemonkey, GM.*value for Greasemonkey 4+

// Settings conversion should be removed after a while, including:
//  - convertOldStyleSettings()
//  - Grant for GM_deleteValue

// Our configuration instance - this loads/saves settings and handles the config popup.
const Config = new GM_config();

(async function ()
{
    'use strict';

    // Find the site that we matched
    const startURL = window.location.href;
    const currentSite = getUserSiteForURL(startURL);
    
    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand('Configure redirect settings', () => Config.open());
    
    // Set up and load config
    let configSettings = buildConfigSettings(currentSite);
    await initConfigAsync(configSettings); // await because we need to read from the resulting (async-loaded) values

    // Convert old-style settings if we find them.
    await convertOldStyleSettings(configSettings);
    
    // Get replacement settings for the current URL
    const replaceSettings = getSettingsForSite(currentSite);
    if (!replaceSettings)
    {
        return;
    }

    // Build new URL
    const newURL = transformURL(startURL, replaceSettings);
    
    // Redirect to the new URL
    if (startURL === newURL)
    { 
        logToConsole("Current URL is same as redirection target: " + newURL);
        return
    }
    window.location.replace(newURL);
})();

// Get the site (entry from user includes/matches) that matches the current URL.
function getUserSiteForURL(startURL)
{
    for (const site of getUserSites())
    {
        // Use a RegExp so we check case-insensitively
        let siteRegex = "";
        if (site.startsWith("/"))
        {
            siteRegex = new RegExp(site.slice(1, -1), "i"); // If the site starts with a /, treat it as a regex (but remove the leading/trailing /)
        }
        else
        {
            siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*"), "i"); // Otherwise replace * wildcards with regex-style [^ ]* wildcards
        }

        if (siteRegex.test(startURL)) {
            return site; // First match always wins
        }
    }
}

// We support both includes and matches, but only the user-overridden ones of each.
function getUserSites()
{ 
    return GM_info.script.options.override.use_matches.concat(GM_info.script.options.override.use_includes);
}

// Perform the replacements specified by the given settings.
function transformURL(startURL, siteSettings)
{
    const { prefix, suffix, targetStrings, replacementStrings } = siteSettings;

    // Transform the URL
    let newURL = startURL;
    for (let i = 0; i < targetStrings.length; i++)
    {
        let toReplace = prefix + targetStrings[i] + suffix;
        const replaceWith = prefix + replacementStrings[i] + suffix;

        // Use a RegEx to allow case-insensitive matching
        toReplace = new RegExp(escapeRegex(toReplace), "i"); // Escape any regex characters - we don't support actual regex matching.

        newURL = newURL.replace(toReplace, replaceWith);
    }

    return newURL;
}

// From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function escapeRegex(string)
{
    return string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

// Log a message to the console with a prefix so we know it's from this script.
function logToConsole(message)
{ 
    console.log("URL Replacer/Redirector: " + message);
}

//#region Config handling
// Build the settings object for GM_config.init()
function buildConfigSettings(currentSite)
{
    // Build fields for each site
    const fields = buildSiteFields(currentSite);

    const styles = `
        /* Float the target strings fields to the left so that they can line up with their corresponding replacements */
        div[id*=${fieldTargetStrings("")}] {
            float: left;
        }

        /* We use one section sub-header on the current site to call it out. We're overriding the
            default settings from the framework (which include the ID), so !important is needed for
            most of these properties. */
        .section_desc {
            float: right !important;
            background: #00FF00 !important;
            color: black !important;
            width: fit-content !important;
            font-weight: bold !important;
            padding: 4px !important;
            margin: 0px auto !important;
            border-top: none !important;
            border-radius: 0px 0px 10px 10px !important;
        }";
    `.replaceAll("\n", ""); // This format is nicer to read but the newlines cause issues in the config framework, so remove them

    return {
        id: "URLReplacerRedirectorConfig",
        title: "URL Replacer/Redirector Config",
        fields: fields,
        css: styles,
    };
}

// Build the specific fields in the config
function buildSiteFields(currentSite)
{
    let fields = {};
    for (const site of getUserSites())
    {
        // Section headers are the site URL as the user entered them
        const sectionName = [site];
        if (currentSite === site)
        {
            sectionName.push("This site"); // If this is the matched site, add a subheader to call it out
        }

        fields[fieldPrefix(site)] = {
            section: sectionName, // Section definition just goes on the first field inside
            type: "text",
            label: "Prefix",
            labelPos: "left",
            size: 75,
            title: "This string (if set) must appear directly before the target string in the URL.",
        }
        fields[fieldSuffix(site)] = {
            type: "text",
            label: "Suffix",
            labelPos: "left",
            size: 75,
            title: "This string (if set) must appear directly after the target string in the URL.",
        }
        fields[fieldTargetStrings(site)] = {
            type: "textarea",
            label: "Targets",
            labelPos: "above",
            title: "Enter one target per line. Each target will be replaced by its corresponding replacement.",
        }
        fields[fieldReplacementStrings(site)] = {
            type: "textarea",
            label: "Replacements",
            labelPos: "above",
            title: "Enter one replacement per line. Each replacement with replace its corresponding target.",
        }
        fields[fieldClearSite(site)] = {
            type: "button",
            label: "Clear redirects for this site",
            title: "Clear all fields for this site, removing all redirection.",
            save: false, // Don't save this field, it's just a button
            click: function (siteToClear)
            {
                return () => {
                    Config.set(fieldPrefix(siteToClear), "");
                    Config.set(fieldSuffix(siteToClear), "");
                    Config.set(fieldTargetStrings(siteToClear), "");
                    Config.set(fieldReplacementStrings(siteToClear), "");
                }
            }(site), // Immediately invoke this wrapper with the current site so the inner function can capture it
        }
    }

    return fields;
}

// This is just a Promise wrapper for GM_config.init that allows us to await initialization.
async function initConfigAsync(settings)
{
    return new Promise((resolve) =>
    {
        // Have the init event (which should fire once config is done loading) resolve the promise
        settings["events"] = {init: resolve};

        Config.init(settings);
    });
}

// Get the settings for the given site.
function getSettingsForSite(site)
{
    if (!site)
    {
        console.log("No matching site found for URL");
        return null;
    }

    // Retrieve and return the settings
    return {
        prefix:             Config.get(fieldPrefix(site)),
        suffix:             Config.get(fieldSuffix(site)),
        targetStrings:      Config.get(fieldTargetStrings(site)).split("\n"),
        replacementStrings: Config.get(fieldReplacementStrings(site)).split("\n"),
    }
}

//#region Field name "constants" based on their corresponding sites
// These are also the keys used with [GM_]Config.get/set.
function fieldPrefix(site)
{
    return "Prefix_" + site;
}
function fieldSuffix(site)
{
    return "Suffix_" + site;
}
function fieldTargetStrings(site)
{
    return "TargetString_" + site;
}
function fieldReplacementStrings(site)
{
    return "ReplacementString_" + site;
}
function fieldClearSite(site)
{
    return "ClearSite_" + site;
}
//#endregion Field name "constants" based on their corresponding sites
//#endregion Config handling

// Convert settings from the old style (simple GM_setValue/GM_getValue storage, 1 config for all
//  sites) to the new style (GM_config, one set of settings per site).
async function convertOldStyleSettings(gmConfigSettings)
{
    // Check the only really required setting (for the script to do anything)
    const replaceAry = GM_getValue("replaceTheseStrings");
    if (!replaceAry)
    {
        return; // No old settings to convert, done.
    }
    logToConsole("Old-style settings found");

    // Safety check: if we ALSO have new-style settings, leave it alone.
    if (GM_getValue("URLReplacerRedirectorConfig"))
    {
        logToConsole("New-style settings already exist, not converting old settings.");
        return;
    }
    
    const replacePrefix = GM_getValue("replacePrefix");
    const replaceSuffix = GM_getValue("replaceSuffix");
    
    // Old style: 1 config for ALL sites
    // New style: 1 config PER site
    // So, the conversion is just to copy the config onto each site.
    logToConsole("Starting settings conversion...");
    for (const site of getUserSites())
    {
        // Split replaceAry into targets (keys) and replacements (values)
        let targetsAry = [];
        let replacementsAry = [];
        for (const target in replaceAry)
        {
            targetsAry.push(target);
            replacementsAry.push(replaceAry[target]);
        }

        Config.set(fieldPrefix(site), replacePrefix);
        Config.set(fieldSuffix(site), replaceSuffix);
        Config.set(fieldTargetStrings(site), targetsAry.join("\n"));
        Config.set(fieldReplacementStrings(site), replacementsAry.join("\n"));
    }

    // Save new settings
    Config.save();
    logToConsole("New-style settings saved.");
    
    // Remove the old-style settings so we don't do this again each time.
    GM_deleteValue("replaceTheseStrings");
    GM_deleteValue("replacePrefix");
    GM_deleteValue("replaceSuffix");
    logToConsole("Old-style settings removed.");
    
    logToConsole("Conversion complete.");
}