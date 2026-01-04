// ==UserScript==
// @name         国人排行助手
// @namespace    http://tampermonkey.net/
// @version      v1.0.3
// @description  内卷！配合使用：https://test-ctmd6jnzo6t9.feishu.cn/share/base/dashboard/shrcnUuQJnG7SSvSmR5zD2c9One
// @author       Stella
// @match        https://www.milkywayidle.com/game?characterId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/500513/%E5%9B%BD%E4%BA%BA%E6%8E%92%E8%A1%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/500513/%E5%9B%BD%E4%BA%BA%E6%8E%92%E8%A1%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


// Store sensitive data securely
const secureData = {
    app_id: "cli_a60588a069f0100b",
    secret: "iX1AKQrtNzGHL1PG9SqjLgmKhRkXtz3z",
    baseToken: "LrVnbwU4aagxWnsGYHtcImEZnEc",
    tableID: "tblEybvb2viNNf3q",
};

let tenant_access_token = "";

hookWS();
getTenantToken();

function hookWS() {
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const oriGet = dataProperty.get;

    dataProperty.get = hookedGet;
    Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

    function hookedGet() {
        const socket = this.currentTarget;
        if (!(socket instanceof WebSocket)) {
            return oriGet.call(this);
        }
        if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
            return oriGet.call(this);
        }

        const message = oriGet.call(this);
        Object.defineProperty(this, "data", { value: message }); // Prevent infinite loops

        return handleMessage(message);
    }
}


function handleMessage(message) {
    try {
        let obj = JSON.parse(message);
        if (obj && obj.type === "profile_shared") {
            const profile = obj.profile;
            const name = profile.sharableCharacter.name;
            const guild_name = profile.guildName;
            const skills = profile.characterSkills;
           const birth = profile.sharableCharacter.createdAt.slice(0, 10).replace(/-/g, '/');



            console.log("Name:", name);
            console.log("Guild Name:", guild_name);
            console.log("Skills and Experience:");

            const info = [name, guild_name, birth];

            const skillOrder = [
                "milking",
                "foraging",
                "woodcutting",
                "cheesesmithing",
                "crafting",
                "tailoring",
                "cooking",
                "brewing",
                "enhancing",
                "stamina",
                "intelligence",
                "attack",
                "power",
                "defense",
                "ranged",
                "magic",
                "total_level",
            ];

            for (let skillName of skillOrder) {
                const skill = skills.find((s) => s.skillHrid.endsWith(skillName));
                if (skill) {
                    const skillLevel = skill.level;
                    const skillExp = Math.round(skill.experience); // 保留经验为整数
                    info.push(skillLevel, skillExp);
                }
            }

            console.log(info.join(", "));
            RecordInfo(info);
        }
    } catch (error) {
        console.error("Error processing message:", error);
        return message;
    }
    return message;
}


async function RecordInfo(info) {
    let [
        姓名,
        公会名,
        生日,
        挤奶等级,
        挤奶经验,
        采摘等级,
        采摘经验,
        伐木等级,
        伐木经验,
        锻造等级,
        锻造经验,
        制作等级,
        制作经验,
        裁缝等级,
        裁缝经验,
        烹饪等级,
        烹饪经验,
        冲泡等级,
        冲泡经验,
        强化等级,
        强化经验,
        耐力等级,
        耐力经验,
        智力等级,
        智力经验,
        攻击等级,
        攻击经验,
        力量等级,
        力量经验,
        防御等级,
        防御经验,
        远程等级,
        远程经验,
        魔法等级,
        魔法经验,
        总等级,
        总经验
    ] = info;

    const req_url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${secureData.baseToken}/tables/${secureData.tableID}/records`;
    const post_header = {
        Authorization: `Bearer ${tenant_access_token}`,
        "Content-Type": "application/json",
    };

    // Build record payload
    const payload = {
        fields: {
            姓名: 姓名,
            公会名: 公会名,
            生日: 生日,
            挤奶等级: 挤奶等级,
            挤奶经验: 挤奶经验,
            采摘等级: 采摘等级,
            采摘经验: 采摘经验,
            伐木等级: 伐木等级,
            伐木经验: 伐木经验,
            锻造等级: 锻造等级,
            锻造经验: 锻造经验,
            制作等级: 制作等级,
            制作经验: 制作经验,
            裁缝等级: 裁缝等级,
            裁缝经验: 裁缝经验,
            烹饪等级: 烹饪等级,
            烹饪经验: 烹饪经验,
            冲泡等级: 冲泡等级,
            冲泡经验: 冲泡经验,
            强化等级: 强化等级,
            强化经验: 强化经验,
            耐力等级: 耐力等级,
            耐力经验: 耐力经验,
            智力等级: 智力等级,
            智力经验: 智力经验,
            攻击等级: 攻击等级,
            攻击经验: 攻击经验,
            力量等级: 力量等级,
            力量经验: 力量经验,
            防御等级: 防御等级,
            防御经验: 防御经验,
            远程等级: 远程等级,
            远程经验: 远程经验,
            魔法等级: 魔法等级,
            魔法经验: 魔法经验,
            总等级: 总等级,
            总经验: 总经验
        },

    };

    // Send POST request to record information
    GM_xmlhttpRequest({
        method: "POST",
        url: req_url,
        headers: post_header,
        data: JSON.stringify(payload),
        onload: function (response) {
            console.log("记录信息响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.code === 0) {
                    console.log("成功记录信息:", responseData.data);
                } else {
                    console.error("记录信息失败或数据格式不正确");
                }
            } catch (error) {
                console.error("解析记录信息响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("Error recording information:", error);
        },
    });
}





// Function to fetch tenant_access_token
async function getTenantToken() {
    const req_url = `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`;
    const payload = {
        app_id: secureData.app_id,
        app_secret: secureData.secret,
    };
    await post_api(req_url, payload);
}

// Utility function to make POST request
async function post_api(req_url, payload) {
    const payloadJson = JSON.stringify(payload);

    let post_header = {
        "Content-Type": "application/json",
    };

    // Send the POST request
    GM_xmlhttpRequest({
        method: "POST",
        url: req_url,
        headers: post_header,
        data: payloadJson,
        onload: function (response) {
            console.log(req_url);
            console.log("响应:", response.responseText);
            try {
                const responseData = JSON.parse(response.responseText);
                if (responseData.tenant_access_token) {
                    tenant_access_token = responseData.tenant_access_token;
                    // Store tenant_access_token securely

                    console.log("获取的 tenant_access_token:", tenant_access_token);
                } else {
                    console.error("未能获取 tenant_access_token");
                }
            } catch (error) {
                console.error("解析响应时出错:", error);
            }
        },
        onerror: function (error) {
            console.error("Error fetching data:", error);
        },
    });
}

