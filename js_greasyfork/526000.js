// ==UserScript==
// @name         红石中继站表情插件
// @namespace    https://forum.mczwlt.net/
// @version      1.7
// @description  社区表情临时插件
// @author       LYOfficial
// @match        https://forum.mczwlt.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526000/%E7%BA%A2%E7%9F%B3%E4%B8%AD%E7%BB%A7%E7%AB%99%E8%A1%A8%E6%83%85%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/526000/%E7%BA%A2%E7%9F%B3%E4%B8%AD%E7%BB%A7%E7%AB%99%E8%A1%A8%E6%83%85%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        const emojis = {
            "童童": [
            "https://forum.mczwlt.net/assets/uploads/files/1738769820971-6a1c09e7-f440-4da7-82bd-c106a278ea88.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769821796-57d3b679-2e88-4613-a42d-eb4aacfbdfc1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769823106-e39d312c-4ae0-4fe8-b13a-ebe818a24950.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769823649-46f09105-b1f4-4f8c-9561-e1825c58d142.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769824212-0dc0dfd7-eca3-4197-9e51-fd4f0753749a.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769825416-0b215fae-f47f-43f7-8973-c9523ca8a8cc.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769851165-193bcf62-9cc8-483c-b9f8-d7562000537e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769851951-71ad6de1-253c-4e42-9e0a-153ff6ca17ee.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769852606-0d11ec33-ca2d-4e95-9c64-badf5e37df25.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769853239-e06d441b-06ae-4f41-a7d1-2d5c6522d77f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769853775-8a3c1d35-61be-41f9-b110-8d2b44ea5f6f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769854351-0779ffcb-c6b2-4515-a751-661804e550d1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769866525-6ec204b8-f530-4a66-932f-a1c52424fae1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769867091-ce618ecc-0ede-4102-8043-86f916361e75.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769867598-51bd7b37-5d84-4190-a7a6-c38875ec4785.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769868176-46449b9d-c7f1-4d31-95aa-06e76fd53c72.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769868705-f97d440d-1a91-4275-a82b-132b46dd0121.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769869258-0a313c21-bcc5-453e-a04d-cd1d494fee05.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769897769-09327c5f-4238-4088-b738-0da265b89f48.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769899016-55fb3d62-1466-4890-ac73-3761287fe73f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769900093-78f9ef97-1301-4287-91a7-f72f6651ef43.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769900619-b9b9cae8-613f-4526-818e-564635d35493.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769901214-abecf24a-28ad-4081-9186-e95dcffe77c2.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769901742-a30ca631-f228-4a86-b6ae-bc579c54e14a.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769918240-52d9b060-9312-4727-a6ab-1b540eb3a294.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769918734-2d57b027-be92-4fbf-ab91-eb53915f7fbb.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769919304-3a1cd06d-14a6-468e-b519-5aab24f5a9fb.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769919862-0d6a3f5d-aaae-4a48-8435-22e65ec049bd.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769920832-121f0030-cd77-4070-bd9b-db9ef66655f3.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769921841-1e0254fc-f34f-4ee7-ae17-5f1e386c0a41.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769935990-15ad5826-a0fe-4cbb-968e-eec3082add11.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769936486-9b2911f9-425b-472b-bdbe-e3252f1fb3b1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769937033-39cfc805-c711-4149-af5f-70be9df6ae0e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769937560-50c41514-f834-4ac1-a2ba-96d714df0b6c.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769938191-bd70ebc4-fa45-4fae-aa6a-dc664abdd1ab.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769938737-99546b30-f048-485b-83ee-8de4bec527e1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769948505-11434e49-b10f-463e-80f9-71b8271633c6.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769949060-83453ca5-6b67-4dad-9d2b-9f8df0984852.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769949695-2390edb4-2b36-4ef0-be05-7f362173a143.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769950322-68661dc1-1c81-4d5f-8376-baa266e5a902.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738769950902-6322be18-a6e7-4594-b422-a5bd36b347ac.png"
        ],
        "绵羊": [
            "https://forum.mczwlt.net/assets/uploads/files/1738770001364-1ed69aef-dbe8-4ea8-8331-a65789be2fb7.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770002255-09e02762-7470-4447-b32a-1c98ebe78ffa.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770002888-c381a2db-ad78-4eac-a9f3-6863592e7b5a.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770003512-b1299e81-35a7-4b3c-a6b5-aea2f60cc340.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770004075-34f6ad45-b5df-4183-bdfe-87d1a2039172.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770004633-0a4fb47a-a9e5-4a55-bd50-32907fad0236.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770005232-d864bf8b-1259-4fe3-876d-144fff64083c.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770012508-12ba3052-90c4-453f-8ecc-92d063f8bf10.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770013108-17122e88-8808-44a1-a65f-0caf68d9f0b2.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770013677-20cedb13-f6de-439b-814b-5b4cc7ddaebe.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770014289-ebe9e8c7-3010-42ab-afee-abc066a7f35f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770014859-b1683121-3cc4-4997-8535-0e39e480e210.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770015489-59a3f0ac-7858-4d00-abb5-c6d0d588d07c.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770016585-d6eb20c7-a542-4a4e-8e45-8b7a4f3fce8e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770030391-a46bfd3a-7308-4f65-94ac-cb4df1e7a34d.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770030999-fad03090-cc6b-47bb-a7cc-2e7b6d2d1544.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770032149-64993130-ed78-4428-86bd-365f8c651554.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770032779-f842ff82-4de9-4b5b-aded-a2ea11877e24.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770033340-d4bab859-acd7-42b1-bdd4-e851918f1939.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770033994-1d817de6-6f40-47a9-93f9-29a5188e61fc.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770034857-e0e7ac14-b579-4fc4-9b84-1fc6e89d840d.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770082927-d317489d-5c11-4ef0-8c2c-2d46fa347df1.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770083860-bc7ad6ef-aaf4-4dd9-a63b-ac04030ade09.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770084436-7c0dcc31-b27b-48df-8757-e8a33908479f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770085104-afc29399-ef4c-4cf1-a37b-22256950c83e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770085682-51d67803-6d3b-421d-aa73-8c15762ba845.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770096628-e930a9d5-38ba-43d0-82f4-c286a08f8e09.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770097254-90f7a57d-989d-466c-8f27-692f1a641ec4.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770097864-e4dbf0a0-64c6-4980-b9a6-641c3e0a8bec.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770098493-99fe4f96-1066-40ad-9dc5-998be3141e3d.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770099583-6d674543-4465-42d0-8796-8c06703f5859.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770129290-a3548ca4-753e-49ec-8d45-f362e2264410.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770130108-95d5e248-c86d-4dd3-bac2-ababcc062569.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770130698-d1e9f676-4fe5-4712-aab5-c9c336b1a352.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770131307-396b3d40-3d5b-40bf-9c2d-db17dece2238.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770145675-83a9eedf-7c0d-4007-8cdc-dc923c62e99f.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770146218-ef42691d-b976-47b7-9c1e-157be111887d.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770146899-6f6f4077-d372-4a90-bcae-2de946322c4e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770147483-395bfd43-98c7-4ef1-99e1-313a4bb4314e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770148057-e3ce0e71-630b-48bb-a1c9-60dd036d39ed.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770158309-f74b31cd-80f3-4bb9-809b-2c5a107e2820.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770158887-c1507dad-9e4c-4316-a818-f49df4e028d8.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770159500-3d688a18-f998-41e4-9938-44150b90041e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770160560-ed212872-53c1-4320-9850-5d8cacfc7d7e.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770161139-aafa863f-3346-4ad2-9161-5e322e3806fb.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770197082-76aa5b95-f98e-472f-86b9-0d70fed1f35a.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770197976-a9992634-8ee9-4e28-9e72-73a9e061380b.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770198740-61bba513-ee9d-4d10-a663-c5e5940bc7d9.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770199320-9dedc147-c62c-4da3-b6aa-48c7b002db43.png",
            "https://forum.mczwlt.net/assets/uploads/files/1738770207076-ba951b84-7f1e-4965-a757-4085f226f87f.png"
        ],
            "默认": [
                "https://forum.mczwlt.net/assets/uploads/files/1738813518549-f0bab031-5107-4318-851c-5d4d2f435eb1.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813519084-9b19a7b0-0bd5-46ea-bf79-c7519ab63d96.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813519658-f639aea7-58b0-448b-910f-0bfcd5c5366e.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813520207-cf900495-6c25-466a-b7ee-ec2ddb998dc7.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813520791-c469b0da-fd6e-40e1-afb8-919f2e10402d.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813571515-cbed55e0-4521-4efd-be87-dd56797bb06f.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813572281-a9e5b4c4-afcd-4066-968f-728aae18d52e.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813572954-df6408a2-e60c-421b-987e-55a99c556719.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813573514-7904e676-bcfc-49ed-8142-4025db437967.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813574071-718af84f-300b-41b9-b28e-92f6a571fea0.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813650757-37aee519-8c0d-4b26-b677-1596e7e969cc.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813651526-4a7c07b2-d6ae-4397-b5e8-ff89cfdcb145.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813652089-0335b355-0394-4e85-ad3d-03d52295803d.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813652720-f09e84f7-ae1c-4e48-abad-6924051c417a.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813653339-bd654b3a-e0fa-4cdb-871f-a626c6fae8b0.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813661040-d89e0488-4208-4544-9972-5a3f021222cb.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813661687-4da0943c-0ec9-43aa-a477-8cb8752757f6.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813662274-833d1030-d622-46a7-b478-d074233d78e0.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813662829-22c455c9-6da4-4e86-8744-0587322f139e.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813663444-852da93a-5b14-43c5-8aab-d1fb876ab870.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813668981-4cbdafd6-51c0-407e-b88d-9a1cc4496ce8.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813669502-c35761a8-c78f-4926-ac78-57ba15db0d9a.gif",
                "https://forum.mczwlt.net/assets/uploads/files/1738813670077-86c592d7-6309-4cc2-bbf6-f800dd24bbf2.gif"
            ]
        };


        const emojiPicker = document.createElement('div');
        emojiPicker.style.position = 'fixed';
        emojiPicker.style.bottom = '10px';
        emojiPicker.style.right = '10px';
        emojiPicker.style.backgroundColor = '#fff';
        emojiPicker.style.border = '1px solid #ccc';
        emojiPicker.style.padding = '10px';
        emojiPicker.style.zIndex = '9999';
        emojiPicker.style.display = 'none';
        emojiPicker.style.maxHeight = '300px';
        emojiPicker.style.overflowY = 'auto';
        emojiPicker.style.width = '200px';

        const categoryButtons = document.createElement('div');
        categoryButtons.style.textAlign = 'center';
        categoryButtons.style.display = 'flex';
        categoryButtons.style.justifyContent = 'space-between';
        emojiPicker.appendChild(categoryButtons);

        const emojiDiv = document.createElement('div');
        emojiDiv.style.display = 'grid';
        emojiDiv.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 每行5个表情
        emojiDiv.style.gap = '5px';
        emojiPicker.appendChild(emojiDiv);

        let currentCategory = "童童";

        function renderEmojis() {
            emojiDiv.innerHTML = '';

            emojis[currentCategory].forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '30px';
                img.style.height = '30px';
                img.style.cursor = 'pointer';
                img.title = '点击插入表情';
                img.onclick = () => insertEmoji(url);
                emojiDiv.appendChild(img);
            });
        }

        function insertEmoji(url) {
            const textArea = document.querySelector('textarea');
            if (textArea) {
                const emojiMarkdown = `![emoji](${url})`;
                textArea.value += emojiMarkdown;
                textArea.focus();
            }
        }

        const createCategoryButton = (category) => {
            const button = document.createElement('button');
            button.className = 'btn btn-sm btn-link text-body fw-semibold composer-minimize'; // 原站风格
            button.innerText = category;
            button.style.margin = '5px';
            button.onclick = () => {
                currentCategory = category;
                renderEmojis();
            };
            categoryButtons.appendChild(button);
        };

        createCategoryButton("童童");
        createCategoryButton("绵羊");
        createCategoryButton("默认");

        const emojiButton = document.createElement('button');
        emojiButton.className = 'btn btn-primary composer-submit fw-bold'; // 添加原站样式
        emojiButton.innerText = '插入表情';
        emojiButton.style.position = 'fixed';
        emojiButton.style.bottom = '10px';
        emojiButton.style.right = '220px';
        emojiButton.style.zIndex = '9999';

        emojiButton.onclick = () => {
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
            emojiButton.innerText = emojiPicker.style.display === 'none' ? '插入表情' : '关闭表情';
            if (emojiPicker.style.display === 'block') {
                renderEmojis();
            }
        };

        document.body.appendChild(emojiPicker);
        document.body.appendChild(emojiButton);
    };
})();