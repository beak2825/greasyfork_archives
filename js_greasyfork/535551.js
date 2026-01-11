// ==UserScript==
// @name           HideAnnoyingPopupsLib
// @description    This script hides the annoying popups that are shown in a web page.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.5
// @author         Cyrano68
// @license        MIT
// @require        https://update.greasyfork.org/scripts/547732/1728184/BasicLib.js
// @grant          none
// @run-at         document-start
// ==/UserScript==

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    blib.consoleLog(`CY==> HideAnnoyingPopupsLib: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const myVersion = "1.1.5";  // It must be the same value indicated in @version.
    blib.consoleLog(`CY==> HideAnnoyingPopupsLib: HELLO! Loading script (version: ${myVersion})...`);

    let showDebugLog = false;
    let mutatedNodesConfig;
    let mutatedAttributesConfig;

    function searchVisibleNode(node, selector)
    {
        const parentElement = node.parentElement;
        return (parentElement === null ? null : parentElement.querySelector(`${selector}:not([style*=\"display:none\"]):not([style*=\"display: none\"])`));
    }

    function onMutatedNodeDefault(mutation, selector, foundNode)
    {
        const parentElement = foundNode.parentElement;
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - selector='${selector}' - parentElement: tagName='${parentElement.tagName}', id='${parentElement.id}'`);

        foundNode.style.display = "none";  // Hide node.
        foundNode.remove();  // Remove node. IMPORTANT: Without this instruction the script does NOT work properly.

        const oldBodyStyle = document.body.getAttribute("style");
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - OLD bodyStyle=${oldBodyStyle}`);

        if (document.body.style.position === "fixed")
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - Removing style 'position: fixed' from BODY`);
            document.body.style.position = "";
            const newBodyStyle = document.body.getAttribute("style");
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - NEW bodyStyle=${newBodyStyle}`);
        }
        if (document.body.style.overflow === "hidden")
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - Removing style 'overflow: hidden' from BODY`);
            document.body.style.overflow = "";
            const newBodyStyle = document.body.getAttribute("style");
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - NEW bodyStyle=${newBodyStyle}`);
        }

        document.body.style.overflowY = "scroll";  // Show vertical scrollbar.
        const newBodyStyle = document.body.getAttribute("style");
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - NEW bodyStyle=${newBodyStyle}`);

        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedNodeDefault - selector='${selector}' - foundNode: tagName='${foundNode.tagName}', classList='${foundNode.classList}' ---> The 'addedNode' has been HIDDEN/REMOVED`);
    }

    function onMutatedAttributeDefault(mutation)
    {
        const oldAttributeValue = mutation.oldValue;
        const newAttributeValue = mutation.target.getAttribute(mutation.attributeName);
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - oldAttributeValue='${oldAttributeValue}', newAttributeValue='${newAttributeValue}'`);

        if ((mutation.attributeName === "class") && (mutation.target.tagName === "HTML") && mutation.target.classList.contains("has--adblock"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.classList='${mutation.target.classList}'`);
            mutation.target.classList.remove("has--adblock");
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.classList='${mutation.target.classList}' ---> attribute modification REMOVED`);
        }
        else if ((mutation.attributeName === "class") && (mutation.target.tagName === "BODY") && mutation.target.classList.contains("noScroll"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.classList='${mutation.target.classList}'`);
            mutation.target.classList.remove("noScroll");
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.classList='${mutation.target.classList}' ---> attribute modification REMOVED`);
        }
        else if ((mutation.attributeName === "style") && (mutation.target.tagName === "HTML") && (mutation.target.style.overflow === "hidden"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.style.overflow='${mutation.target.style.overflow}'`);
            mutation.target.style.overflow = "";
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.style.overflow='${mutation.target.style.overflow}' ---> attribute modification REMOVED`);
        }
        else if ((mutation.attributeName === "style") && (mutation.target.tagName === "BODY") && (mutation.target.style.overflow === "hidden"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.style.overflow='${mutation.target.style.overflow}'`);
            mutation.target.style.overflow = "";
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.style.overflow='${mutation.target.style.overflow}' ---> attribute modification REMOVED`);
        }
        else if ((mutation.attributeName === "style") && (mutation.target.tagName === "HTML") && (mutation.target.style.overflowY === "hidden"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.style.overflowY='${mutation.target.style.overflowY}'`);
            mutation.target.style.overflowY = "";
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.style.overflowY='${mutation.target.style.overflowY}' ---> attribute modification REMOVED`);
        }
        else if ((mutation.attributeName === "style") && (mutation.target.tagName === "BODY") && (mutation.target.style.overflowY === "hidden"))
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - BEFORE: mutation.target.style.overflowY='${mutation.target.style.overflowY}'`);
            mutation.target.style.overflowY = "";
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutatedAttributeDefault - AFTER: mutation.target.style.overflowY='${mutation.target.style.overflowY}' ---> attribute modification REMOVED`);
        }
    }

    function onMutationList(mutationList, observer)
    {
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- mutationList.length=${mutationList.length}`, showDebugLog);
        mutationList.forEach((mutation, i) =>
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- i=${i} - mutation.type=${mutation.type}`, showDebugLog);
            if (mutation.type === "childList")
            {
                blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- i=${i} - mutation.addedNodes.length=${mutation.addedNodes.length}`, showDebugLog);
                const addedNodes = mutation.addedNodes;
                if (addedNodes.length > 0)
                {
                    blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- addedNodes.length=${addedNodes.length}`, showDebugLog);
                    addedNodes.forEach((addedNode, j) =>
                    {
                        if ((mutatedNodesConfig !== undefined) && (mutatedNodesConfig !== null))
                        {
                            const selectors     = mutatedNodesConfig.selectors;
                            const onMutatedNode = mutatedNodesConfig.onMutatedNode;

                            if ((selectors !== undefined) && (selectors !== null))
                            {
                                blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- selectors.length=${selectors.length}`, showDebugLog);
                                for (let k = 0; k < selectors.length; ++k)
                                {
                                    const selector  = selectors[k];
                                    const foundNode = searchVisibleNode(addedNode, selector);

                                    if ((foundNode !== undefined) && (foundNode !== null))
                                    {
                                        let stopMutationProcessing = false;
                                        if (onMutatedNode && (typeof(onMutatedNode) === "function"))
                                        {
                                            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList - i=${i}, j=${j}, k=${k} - BEFORE 'onMutatedNode(...)'`);
                                            stopMutationProcessing = onMutatedNode(mutation, selector, foundNode);
                                            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList - i=${i}, j=${j}, k=${k} - AFTER 'onMutatedNode(...)' - stopMutationProcessing=${stopMutationProcessing}`);
                                        }

                                        if (stopMutationProcessing)
                                        {
                                            break;
                                        }
                                        else
                                        {
                                            onMutatedNodeDefault(mutation, selector, foundNode);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
            else if (mutation.type === "attributes")
            {
                blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- i=${i} - mutation.target.tagName='${mutation.target.tagName}', mutation.attributeName='${mutation.attributeName}', mutation.oldValue='${mutation.oldValue}'`, showDebugLog);
                if ((mutatedAttributesConfig !== undefined) && (mutatedAttributesConfig !== null))
                {
                    const attributeInfos     = mutatedAttributesConfig.attributeInfos;
                    const onMutatedAttribute = mutatedAttributesConfig.onMutatedAttribute;

                    if ((attributeInfos !== undefined) && (attributeInfos !== null))
                    {
                        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList -D- attributeInfos.length=${attributeInfos.length}`, showDebugLog);
                        for (let j = 0; j < attributeInfos.length; ++j)
                        {
                            let attributeInfo = attributeInfos[j];
                            let attributeName = attributeInfo.attributeName;
                            let targetTagName = attributeInfo.targetTagName;

                            if ((mutation.attributeName === attributeName) && (mutation.target.tagName === targetTagName))
                            {
                                let stopMutationProcessing = false;
                                if (onMutatedAttribute && (typeof(onMutatedAttribute) === "function"))
                                {
                                    blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList - i=${i}, j=${j} - BEFORE 'onMutatedAttribute(...)'`);
                                    stopMutationProcessing = onMutatedAttribute(mutation);
                                    blib.consoleLog(`CY==> HideAnnoyingPopupsLib: onMutationList - i=${i}, j=${j} - AFTER 'onMutatedAttribute(...)' - stopMutationProcessing=${stopMutationProcessing}`);
                                }

                                if (stopMutationProcessing)
                                {
                                    break;
                                }
                                else
                                {
                                    onMutatedAttributeDefault(mutation);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function configure(mutationObserverConfigIn, mutatedNodesConfigIn, mutatedAttributesConfigIn)
    {
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - BEGIN`);

        // SEE: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        // Create an observer instance linked to the callback function.
        const mutationObserver = new MutationObserver(onMutationList);

        mutatedNodesConfig      = mutatedNodesConfigIn;
        mutatedAttributesConfig = mutatedAttributesConfigIn;

        let selectorsLength      = 0;
        let hasOnMutatedNodeFunc = false;
        if ((mutatedNodesConfig !== undefined) && (mutatedNodesConfig !== null))
        {
            const selectors = mutatedNodesConfig.selectors;
            if ((selectors !== undefined) && (selectors !== null))
            {
                selectorsLength = mutatedNodesConfig.selectors.length;
            }

            const onMutatedNode = mutatedNodesConfig.onMutatedNode;
            if (onMutatedNode && (typeof(onMutatedNode) === "function"))
            {
                hasOnMutatedNodeFunc = true;
            }
        }
        if (selectorsLength == 0)
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - mutatedNodesConfig.selectors.length=${selectorsLength}, hasOnMutatedNodeFunc=${hasOnMutatedNodeFunc}`);
        }
        else
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - mutatedNodesConfig.selectors.length=${selectorsLength}, mutatedNodesConfig.selectors='${mutatedNodesConfig.selectors}', hasOnMutatedNodeFunc=${hasOnMutatedNodeFunc}`);
        }

        let attributeInfosLength      = 0;
        let hasOnMutatedAttributeFunc = false;
        if ((mutatedAttributesConfig !== undefined) && (mutatedAttributesConfig !== null))
        {
            const attributeInfos = mutatedAttributesConfig.attributeInfos;
            if ((attributeInfos !== undefined) && (attributeInfos !== null))
            {
                attributeInfosLength = mutatedAttributesConfig.attributeInfos.length;
            }

            const onMutatedAttribute = mutatedAttributesConfig.onMutatedAttribute;
            if (onMutatedAttribute && (typeof(onMutatedAttribute) === "function"))
            {
                hasOnMutatedAttributeFunc = true;
            }
        }
        if (attributeInfosLength == 0)
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - mutatedAttributesConfig.attributeInfos.length=${attributeInfosLength}, hasOnMutatedAttributeFunc=${hasOnMutatedAttributeFunc}`);
        }
        else
        {
            blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - mutatedAttributesConfig.attributeInfos.length=${attributeInfosLength}, mutatedAttributesConfig.attributeInfos='${JSON.stringify(mutatedAttributesConfig.attributeInfos)}, hasOnMutatedAttributeFunc=${hasOnMutatedAttributeFunc}'`);
        }

        // Start observing the target node for configured mutations.
        mutationObserver.observe(document, mutationObserverConfigIn);

        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: configure - END`);
    }

    function getVersion()
    {
        return myVersion;
    }

    function setShowDebugLog(showDebugLogIn)
    {
        showDebugLog = showDebugLogIn;
        blib.consoleLog(`CY==> HideAnnoyingPopupsLib: setShowDebugLog - showDebugLog=${showDebugLog}`);
    }

    // Expose the public interface by returning an object
    window.HideAnnoyingPopupsLib =
    {
        configure:       configure,
        getVersion:      getVersion,
        setShowDebugLog: setShowDebugLog
    };

    blib.consoleLog("CY==> HideAnnoyingPopupsLib: Script loaded");
})();
