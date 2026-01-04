"use strict";
async function replaceJjwxcCharacter(fontName, inputText) {
    let outputText = inputText;
    const jjwxcFontTable = await getJjwxcFontTable(fontName);
    if (jjwxcFontTable) {
        for (const jjwxcCharacter in jjwxcFontTable) {
            const normalCharacter = jjwxcFontTable[jjwxcCharacter];
            outputText = outputText.replaceAll(jjwxcCharacter, normalCharacter);
        }
        outputText = outputText.replaceAll("‌\u200c", "");
    }
    return outputText;
}
async function getJjwxcFontTable(fontName) {
    return await fetchRemoteFont(fontName);
}
async function fetchRemoteFont(fontName) {
    const url = `https://jjwxc.bgme.bid/${fontName}.json`;
    try {
        console.info(`[jjwxc-font]开始请求远程字体对照表 ${fontName}`);
        const resp = await fetch(url);
        if (resp.status === 200) {
            console.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载成功`);
            return (await resp.json());
        }
        else {
            console.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载失败`);
            return undefined;
        }
    }
    catch (error) {
        console.error(error);
        console.info(`[jjwxc-font]远程字体对照表 ${fontName} 下载失败`);
        return undefined;
    }
}
