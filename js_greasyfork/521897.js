// ==UserScript==
// @name         kamyki 
// @match        https://*.margonem.pl/
// @grant        none
// @autor        kvvbaxik
// @description  grafika mobów na kamykach
// @version 0.0.1.20241226221240
// @namespace https://greasyfork.org/users/867683
// @downloadURL https://update.greasyfork.org/scripts/521897/kamyki.user.js
// @updateURL https://update.greasyfork.org/scripts/521897/kamyki.meta.js
// ==/UserScript==


!function() {
    const config = {
        // TOPKA E2
        "2353":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu03.gif",//art
        "2354":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu01.gif",//zor
        "2356":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu02.gif",//fur
        "3039":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif",//set
        "3035":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/chopesh2.gif",//chop
        "6064":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif",//monia
        "5695":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif",//monia
        "1901":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif",//ciut
        "5672":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif",//ciut
        "4056":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif",//syb
        "4057":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif",//syb
        "3327":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif",//terro
        "3341":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smokoszef.gif",//przedsion
        "3339":"https://micc.garmory-cdn.cloud/obrazki/npc/her/smokbarb.gif",//chaegd
        "3340":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif",//vera
        "5694":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif",//jajo
        "5695":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif",//jajo
        "5693":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif",//jajo
        "5685":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl.gif",//p9

        // MAGUA E2
        "3610":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif",//dendro
        "3597":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif",//dendro
        "1462":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok_roz.gif",//panc
        "5657":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/bolita.gif",//bolitson
        "3627":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/silvanasus.gif",//silv
        "2766":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/marlloth.gif",//marloth
        "1142":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif",//gruba dupa
        "1480":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok5.gif",//mocny
        "1481":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok5.gif",//mocny
        // SEKTA E2
        "5943":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-zufulus.gif",//zuf
        "5945":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-bergermona.gif",//berg
        "5942":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif",//sat
        "5942":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-annaniel.gif",//tś
        "5940":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sadolia.gif",//sado
        // 190 E2
        "972":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolszczur.gif",//mysz
        "2063":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/draki-breheret-1b.gif",//breh
        "6053":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/thuz-patr1.gif",//tor
        "1912":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/forbol03.gif",//furb
        "6057":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/drzewoe2.gif",//ceras
        "6055":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia.gif",//chryz
        "6054":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia.gif",//chryz
        "7345":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif",//krolowa sniegu
        // 167 E2
        
        "5861":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_mag_elita.gif",//sk
        "5861":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_drapak.gif",//ogr
        "5872":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/duch_wladcy_kl.gif",//dwk
        "1322":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri_adariel.gif",//ada
        "359":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/mechgoblin4.gif",//gons
        //144 E2
        "1276":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif",//worek
        "3255":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif",//stw
        "3265":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif",//amun
        "6955":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif",//gruber
        "5856":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif",//bur
        "5855":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif",//bur
        "5851":"https://micc.garmory-cdn.cloud/obrazki/npc/e1/pirat5b.gif",//henry
        "7340":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-wojt-fistula.gif",//wujt
        "7338":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-tesciowa-rumcajsa.gif",//tesciowa
        "7352":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif",//eol
        //RENEGAT E2
        "1527":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif",//HELGA
        "3409":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif",//JACK

        "7057":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/magradit_ifryt.gif",//IFRYT
        "1620":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif",//krab
        "4271":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif",//krab
        "7069":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/mumia-ozirus.gif",//Ozirus
        "7066":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif",//łc
        "7065":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif",//łc
        "6945":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_lowcow.gif",//mł
        "6946":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_magii.gif",//mm
        "6944":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_rycerzy.gif",//mr
        "6937":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif",//jert
        "6938":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif",//jert
        "229":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/kambion.gif",//kambion
        "3765":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/cent-zyfryd.gif",//zyfryd
        "6781":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif",//gnom
        "6780":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif",//gnom
        // 83 E2
        "1150":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/goplana.gif",//gop
        "3466":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/ugrape2.gif",//ochyda
        "1325":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif",//widmo
        "1324":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif",//widmo
        "6772":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/nadzorczyni_krasnoludow.gif",//nadzorczyni
        "6634":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif",//chouk
        "6636":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif",//chouk
        "6615":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/magaz_zbrojmistrz.gif",//zbroj
        "1204":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/wlochacze_wielka_stopa.gif",//stopa
        "6623":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/nieu_mnich_grabarz.gif",//grab
        "6625":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/lisz_demilisze.gif",//lisz
        "6632":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_utumatu.gif",//tolloki
        "6537":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/kam_olbrzym-b.gif",//jotun
        // 0-64 E2
        "3436":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll12.gif",//koza
        "333":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll11.gif",//vari
        "5395":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/zadlak-e2-owadzia-matka.gif",//osa
        "816":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif",//fov
        "2729":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif",//fov
        "176":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif",//agar
        "177":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif",//agar
        "125":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/razuglag.gif",//razuglag
        "2308":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif",//ali
        "5293":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif",//tollok
        "4156":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif",//dzik
        "3149":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif",//gobb
        "727":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif",//wład
        "2532":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif",//zorg
        "5740":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif",//shae
        "5738":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif",//shae
        "632":"https://micc.garmory-cdn.cloud/obrazki/npc/e1/kotolak_lowca.gif",//kotolak
        "1060":"https://micc.garmory-cdn.cloud/obrazki/npc/e2/st-puma.gif",//mushita
        // Kolosi
        "4268":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif",//279
        "1131":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif",//225
        "4206":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif",// 225v2
        "4266":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif",// 252
        "4196":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolkrucz.gif",//lulukav
        "4066":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif",//hydra
        "4161":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wazka.gif",//wazka
        "1739":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif",//umi
        "4046":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif",//sopel
        "3883":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif",//regu
        "3361":"https://micc.garmory-cdn.cloud/obrazki/npc/kol/mamlambo_final2.gif",//lambo
        // Tytani
        "5709":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif",//teza
        "5708":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif",//teza2
        "2021":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok-tytan.gif",//Magua1
        "2024":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok-tytan.gif",//Magua2
        "2355":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif",//przejscie
        "2357":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif",//TH
        "3312":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/hebrehoth_smokoludzie.gif",//BB
        "6476":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif",//przyzy
        "5946":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif",//przyzy
        "6477":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif",//lowka
        "5985":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif",//lowka
        "6478":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titangoblin.gif",//zons
        "1898":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titangoblin.gif",//zons
        "7058":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif",//arcy
        "7059":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif",//arcy
        "7060":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif",//arcy
        "6949":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif",//rene
        "6947":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif",//rene
        "3766":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif",//rene
        "1746":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif",//kic
        "3300":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif",//kic
        "189":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif",//orla
        "188":"https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif",//orla
        //kendal
        "1224":"https://media.discordapp.net/attachments/803736985163792435/1317119611359199243/image-removebg-preview.png?ex=675d86ba&is=675c353a&hm=0822c06857d963f0c23481f71f81415e7fee5abbdb15d16d7f2443e75e786409&=&format=webp&quality=lossless",
       
      
    }

    const NI = typeof window.Engine != "undefined";

    function loadItemImage(url) {
        const $newImg = document.createElement("img");
        $newImg.src = url;
        $newImg.classList.add("overlay");
        return new Promise(resolve => {
            $newImg.addEventListener("load", () => {
                let w = $newImg.width, h = $newImg.height;
                if (h > 32) {
                    w = w * (32 / h);
                    h = 32;
                }
                if (w > 32) {
                    h = h * (32 / w);
                    w = 32;
                }
                const offset = (32 - w) / 2;
                $newImg.width = w;
                $newImg.height = h;
                $newImg.style.left = `${offset}px`;
                $newImg.style.display = "block";

                resolve($newImg);
            });
        });
    }

    async function appendItemOverlay(id, url) {
        if (NI) {
            const $it = document.querySelector(`.item-id-${id}`);
            if ($it) {
                $it.classList.add("small-icon");
                const $newImg = await loadItemImage(url);
                $newImg.style.position = "absolute";
                $newImg.zIndex = 1;
                const $canv = $it.querySelector("canvas");
                $canv.parentElement.appendChild($newImg);
                console.log($it);
            }
        } else {
            g.loadQueue.push({
                fun: async () => {
                    const $it = document.querySelector(`#item${id}`);
                    if ($it) {
                        $it.classList.add("small-icon");
                        const $newImg = await loadItemImage(url);

                        const $img = $it.querySelector("img");
                        if ($img) {
                            $img.parentElement.appendChild($newImg);
                        }
                    }
                }
            });
        }
    }

    function onItem(items) {
        for (const id in items) {
            const it = items[id];
            const tp = getItemTp(it);
            const tpMap = getTpMap(tp);
            const entry = config[tp] ?? config[tpMap];
            if (entry) {
                appendItemOverlay(id, entry);
            }
        }
    }

    function init() {
        const org = NI ? window.Engine.communication.parseJSON : window.parseInput;
        const override = function(data) {
            const res = org.apply(this, arguments);
            if (data.item) {
                onItem(data.item);
            }
            return res;
        }
        if (NI)
            window.Engine.communication.parseJSON = override;
        else
            window.parseInput = override;

        const css = `
            /* SI */
            .small-icon img:not(.overlay) {
                width: 0px;
                height: 0px;
                top: 12px;
                z-index: 1;
            }

            /* NI */
            .small-icon canvas.canvas-icon {
                width: 0px;
                height: 0px;
                top: 12px;
                z-index: 1;
            }
            .small-icon .amount, .small-icon .cooldown {
                z-index: 2;
            }
        `;

        const $style = document.createElement("style");
        $style.innerHTML = css;
        document.head.appendChild($style);
    }

    function parseStats(stats) {
        if (!stats)
            return {};

        const spl = stats.split(";");
        const res = {};
        for (const entry of spl) {
            const pair = entry.split("=");
            res[pair[0]] = pair[1] ?? "true";
        }
        return res;
    }

    function getItemStats(it) {
        return it._cachedStats ?? parseStats(it.stat);
    }

    function getItemTp(it) {
        const stats = getItemStats(it);
        if (stats.teleport || stats.custom_teleport && stats.custom_teleport != "true") {
            return stats.teleport ?? stats.custom_teleport;
        }
        return "";
    }

    function getTpMap(tp) {
        return tp.split(",")[0];
    }

    function getLocationItems(loc) {
        return NI ? Engine.items.fetchLocationItems(loc).map(it => it) : Object.values(g.item).filter(it => it.loc == loc);
    }

    window.listStones = function() {
        getLocationItems("g").forEach(it => {
            const stats = getItemStats(it);

            const tp = getItemTp(it);

            if (tp != "") {
                const tpMap = getTpMap(tp);
                window.log(`${it.name} (${stats.opis}): ${tpMap} (${tp})`);
            }
        });
    }

    init();
}();