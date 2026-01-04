// ==UserScript==
// @name         Telegram new episode finder for MAL watching list page and anime list
// @namespace    https://github.com/kingofnull/mal-tg-episode-finder
// @version      2.00
// @description  Find new unwatched episode from your disired Telegram channel/group/peer... and show a link to it in front of each anime on your MAL CURRENTLY WATCHING page.
// @author       KingOfNull
// @homepage     https://github.com/kingofnull/mal-tg-episode-finder
// @match        https://myanimelist.net/animelist/*?*status=1*
// @match        https://myanimelist.net/anime/*/*
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/436807/Telegram%20new%20episode%20finder%20for%20MAL%20watching%20list%20page%20and%20anime%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/436807/Telegram%20new%20episode%20finder%20for%20MAL%20watching%20list%20page%20and%20anime%20list.meta.js
// ==/UserScript==



function addScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');

        s.setAttribute('src', src);
        s.addEventListener('load', resolve);
        s.addEventListener('error', reject);

        document.body.appendChild(s);
    });
}


async function initTgClient(){

    //you can use mine or generate your own one
    const apiId = 1799740; // put your api id here [for example 123456789]
    const apiHash = "645175d3249752aa32bce7b4659cfd94"; // put your api hash here [for example '123456abcfghe']


    const session = localStorage.getItem('TgStrSession') ?? "";
    const {TelegramClient} = gramjs;
    const { StringSession } = gramjs.sessions;

    const client = new TelegramClient(new StringSession(session), apiId, apiHash, {
        connectionRetries: 3,
    });
    
    //await client.connect();
    await client.start({
        phoneNumber: async () => prompt("Please enter your number: "),
        password: async () => prompt("Please enter your password: "),
        phoneCode: async () => prompt("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });

    client.session.setDC(4, 'kws4.web.telegram.org', 443);//wss://kws4.web.telegram.org/apiws

    localStorage.setItem('TgStrSession',client.session.save());
    
    return client;
}

function getPeerIds(){
     //find your peerId using @username_to_id_bot in telegram
    let peerId=localStorage.getItem("TgSearchPeerId");
    if(!peerId){
        peerId=prompt("Enter your search target peerId:");
        localStorage.setItem("TgSearchPeerId",peerId);
    }

    let peerIds=peerId.split(",").map(p=>p*1);
    
    return peerIds;
    
}

async function findNewEp(client,name,ep,peerId,withOutLeadingZero){
        const {Api} = gramjs;
        let nextEpStr=(ep*1+1).toString();
        if(!withOutLeadingZero){
            nextEpStr=nextEpStr.padStart(2,'0');
        }

        let searchTerm=`"${name} ${nextEpStr}"`;
        console.log("search for:",searchTerm);
        const result = await client.invoke(
            new Api.messages.Search({
                peer: peerId,
                q: searchTerm,
                filter: new Api.InputMessagesFilterDocument({}),
                limit:10,
            })
        );

        if(result.count<1){
            console.warn("not found");
            if(!withOutLeadingZero){
                return await findNewEp(client,name,ep,peerId,true);
            }
            return null;
        }

        let message=result.messages.at(0);
        let fname=message.media.document.attributes.at().fileName;
        console.log(result.count,fname); // prints the result
        /*
        const linkResult = await client.invoke(
            new Api.channels.ExportMessageLink({
                channel: peerId,
                id: message.id,
                thread: true,
            })
        );
        let link=linkResult.link;
*/
        let link=`tg://privatepost?channel=${message.peerId.channelId}&post=${message.id}`;
        console.log(link);
        return {link,fname};
}


function initRenamer($title){
    const orgName= $title.text();
    const renameKey="acname-"+orgName;


    const customName=localStorage.getItem(renameKey);
    if(customName){
        $title.text(customName);
    }

    $title.siblings(".rename-btn").remove();
    $("<a>",{class:'rename-btn'}).text("Rename").insertAfter($title).click(e=> {
        let newname=prompt("Enter new name:",$title.text());
        if(newname===""){
            localStorage.removeItem(renameKey);
            $title.text(orgName);
        }else if(newname!==null){
            localStorage.setItem(renameKey,newname);
            $title.text(newname);
        }
    });

    return $title.text();
}

async function searchAllPeers(client,title,curEp){
    let data;
    for(let pId of getPeerIds()){
        try{
            data=await findNewEp(client,title,curEp,pId);
        }catch(e){
            console.error('FindNewEp Failed,PID:',pId,e);
        }

        if(data){
            break;
        }
    }
    
    return data;
}

(async ()=> {
    await addScript('https://cdn.jsdelivr.net/gh/kingofnull/gramjs-browser-build@69e9b471e30bb6da54577f911c953e1bf646b98b/gramjs.js');
    
    
    //-----------------------------------watching list page handler------------------------------------------//
    
    if(/https:\/\/myanimelist.net\/animelist\/[^\/]/i.test(document.URL)){
        GM_addStyle(`
                .new-ep-link{
                 background: #a70000;
                 color: white !important;
                 padding: 5px 7px;
                 border-radius: 7px;
                 display:inline-block;
                 padding:5px;
                 margin-left: 0.5em;
                }

                .list-table .list-table-data .data a.new-ep-link:hover {
                    color: #a70000 !important;
                    background: white !important;
                }

                .rename-btn{
                    background: #009688;
                    padding: 0.2em 0.4em;
                    border-radius: 0.5em;
                    color: white !important;
                    position: relative;
                    /* top: -10px; */
                    cursor: pointer;
                    margin-left: 0.5em;
                }

                .list-table .list-table-data .data a.rename-btn:hover {
                    background: #ffffff !important;
                    color:  #009688 !important;
                }

        `);

        
       let client=await initTgClient();
       for(let r of $("td.title a.link").get()){
            let $r=$(r);
            //let title=$r.text();
            let title=initRenamer($r);
            let curEp=$r.parents("tr").find("td.progress a.link").text();
            if(!Number(curEp)){
                curEp="0";
            }

            title=initRenamer($r);
            
            console.log(title,":",curEp);
            
            let data=await searchAllPeers(client,title,curEp);

            if(data){
                $("<a>",{href:data.link,class:'new-ep-link',target:"tgLinksWin"})
                    .text("New Ep ! : "+data.fname)
                    .appendTo($r.parents("td"));
            }
        } 
        client.disconnect();
    }    
    
    
    //-------------------------------- Anime page handler------------------------------------------//
    
    if(/https:\/\/myanimelist.net\/anime\/\d+\/[^\/]/i.test(document.URL)){
        GM_addStyle(`
            .new-ep-link{
             background: #a70000;
             color: white !important;
             padding: 5px 7px;
             border-radius: 7px;
             display:inline-block;
             padding:5px;
             margin: 0.5em 0;
            }

            a.new-ep-link:hover {
                color: #a70000 !important;
                background: white !important;
            }

            .rename-btn {
                background: #009688;
                padding: 0.2em 0.4em;
                border-radius: 0.5em;
                color: white !important;
                position: relative;
                top: -7px;
                cursor: pointer;
                margin: 1em 0.5em;
            }


            a.new-ep-link, a.rename-btn {
                font-size: 10px !important;
                font-family: monospace !important;
            }
        `);
        
        async function findAndShowLink(){
            $('#next-ep-link').remove();
            let client=await initTgClient();
            
          

            let $r=$(".title-name").first();
            let title=initRenamer($r);

            let curEp=$("#myinfo_watchedeps").val();
            if(!Number(curEp)){
                curEp="0";
            }
            console.log(title,":",curEp);


            let data=await searchAllPeers(client,title,curEp);
            
            if(data){
                $("<a>",{href:data.link,class:'new-ep-link',target:"tgLinksWin", id:'next-ep-link'})
                        .text("New Ep ! : "+data.fname)
                        .appendTo($r.parent());
            }
            
            client.disconnect();
            
        }
        
        $(".js-btn-count").on("click", ()=>findAndShowLink());
        $("#myinfo_watchedeps").on('change blure',e=>fetchDlLink());
        findAndShowLink();
    }
    

    

    
})();