// ==UserScript==
// @name         Piratinha de Ouro (Google Filmes & Séries)
// @namespace    https://linkme.bio/jhonpergon/?userscript=piratinha
// @version      1.9
// @author       Jhon Pérgon

// @description  Ajuda você a encontrar seu filme ou série online no Google filtrando +750 resultados irrelevantes/spam/pagos >> Atualizado 2025.

// @include      *://www.google.*
// @include      *://www.google.it/*

// @match        https://embed.embedplayer.site/*
// @match        https://embedplayer.online/*
// @match        *://embedder.net/v/*
// @match        https://gofilmes.me/*

// @exclude      *://www.google.com.br/advanced_search
// @exclude      *://www.google.com/sorry/*
// @exclude      /^(https:\/\/www.google\.(com|it)\/)(finance|preferences|maps\?q=.*|flights\?q=.*|.*tbm=isch)(\/.*)?/

// @icon         https://static.wikia.nocookie.net/hero-tale-idle-rpg/images/f/f8/Pirate_Coin_icon.png/revision/latest/thumbnail/width/360/height/360?cb=20210712122314
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes

// @name:pt        Piratinha de Ouro (Google Filmes & Séries)
// @name:pt-BR        Piratinha de Ouro (Google Filmes & Séries)
// @name:pt-PT        Piratinha de Ouro (Google Filmes & Séries)

// @description:pt        Ajuda você a encontrar seu filme ou série online no Google filtrando +750 resultados irrelevantes/spam/pagos >> Atualizado 2025.
// @description:pt-BR        Ajuda você a encontrar seu filme ou série online no Google filtrando +750 resultados irrelevantes/spam/pagos >> Atualizado 2025.
// @description:pt-PT        Ajuda você a encontrar seu filme ou série online no Google filtrando +750 resultados irrelevantes/spam/pagos >> Atualizado 2025.

// @license        MIT

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/482714/Piratinha%20de%20Ouro%20%28Google%20Filmes%20%20S%C3%A9ries%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482714/Piratinha%20de%20Ouro%20%28Google%20Filmes%20%20S%C3%A9ries%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (GM_getValue('Amount of results to Show') === undefined) //If the amount of results to show isn't defined
  { //Starts the if condition
    GM_setValue('Amount of results to Show', 350); //Set the default amount of results to show as 100
    GM_setValue('Open in new window?', 0); //Set the script to not open websites on a new tab
  } //Finishes the if condition

    //If the current search doesn't have the user choices applied
  if (location.pathname === '/search' && location.href.match('&num=' + GM_getValue('Amount of results to Show') + '&newwindow=' + GM_getValue('Open in new window?')) === null)
  { //Starts the if condition
    location.href = location.href += '&num=' + GM_getValue('Amount of results to Show') + '&newwindow=' + GM_getValue('Open in new window?'); //Redirect to add the user choices
  } //Finishes the if condition



const palavrasSalvas = `$,
plus.com,
youtube.com,
instagram.com,
twitter.com,
https://x.com,
facebook.com,
tiktok.com,
spotify.com,
//t.me,
reddit.com,
https://www.netflix.com,
.globo.com,
https://www.kwai.com,
.apple.com,
https://www.tiktok.com,
https://www.primevideo.com,
.vivoplay.com,
justwatch.com,
hbomax.com,
disneyplus.com,
disney.com,
claro.com,
netmovies.com,
assistironline.net,
amazon.com,
clarotvmais.com,
starplus.com,

seufilme.net,
seufilme.bet,
seufilme.us,
topflix.surf,
topflix.gift,
https://furiaflix,
pobreflix,
arkfilmes,
oldflix.com,
filmesdetv.com,
https://coworkcayman.com,
https://meucinema.org,
datacamp.com,
filmesonlinegratis.cloud,
teacherspayteachers,
filmesonlinegratis4k,
pobretv,
https://filmow.,
overflix.ac,
megacine.to,
megaseries.to,
megaseries-1.com,
avancegames.com,
popflixhd.com,
play.tuaserie.net,
serieonline.cc,
temseries.online,
cinegato.tv,

imdb.com,
mubi.com,
https://www.adorocinema.com,
AdoroCinema,
https://cinepop.com,
https://cineato.com,
https://www.estadao.com,
uol.com,
ign.com,
omelete.com,
cineset.com,
cinea.com,
estacaonerd.com,
cosmonerd.com,
cafecomfilme.com,
https://www.memoriadatv.com,
https://cinemacao.com,
ovicio.com,
surveymonkey.com,
deviantart.com,
ingresso.com,
deviantart.com,
cinemococa.com,
ucicinemas.com,
replit.com,
sketchfab.com,
veloxtickets,
cinevilarica.com,
techtudo.com,
tecmundo.com,
tecnoblog.net,
enjoei.com,
nrfilmes.com,
g1filmes.com,
filmesmega.co,
filmesonlinehdgratis.com,
hdfilmesonlinegratis.org,
filmesonlinex,
maxserieshd,
ultracine,
serieflix2.to,
megafilmeshdx,
seriesonlinemax,
superflix,
cineplay.to,
megafilmes.blog,
topflix.care,
topflix.app,
anroll.net,
.angel.com,
topflix.city,
filmestipo.com,
filmesmuitoraros.com,
http://redskyfilmes.blogspot.com,
filmesgratisassistironline.com,
xilften.io,
superfilmes.net,
baixefilmesgratis.,
sonidofocalizado.com,
.ultimatesanitarysupply.,
gbnmjy.com,
hdavidhenson,
ciacomunicacion,
bedsyp.com,
.co.ua,
ufl-log.t2,
assistirfilmesdublados.net,
megaflix.co,
megaflix.cx,
//so-filmes-e-series-dublados.,
//ultraflix.,
rakuten.tv,
loveflix.black,
basf.com,
taskade.com,
megafilmesx.online,
.expandcart.,
hihonor.com,
acidadeon.com,
legiaodosherois.com,
cinemark.com,
gamma.app,
atarigamesna,
mega-filmes.net,
overflix.shop,
megafilmeshdd.com,
filmesonline4k.tv,
suatela.net,
tuaseriehd.to,
hypeflix.net,
serieflix.to,
assistirfilmeshdgratis.net,
supercine.net,
filmesonlinegratishd.com,
topflix.kim,
showmetech.com,
500px.com,
slashpage.com,
cinepolis.com,
timenews.com,
forbes.com,
filmesxp.com,
filmize.in,
industrialvacuumsystems,
filmesepicos.com,
castbox.fm,
pledge.to,
filmesonlinegratis.tube,
//playfilmes.org,
febspot.com,
overflix.run,
thenightseriesbr.com,
filmicca.com.br,
streamingsbrasil.com,
seriesflix1.to,
hiperflixbr.to,
seriesflixtv2.to,
supertela.skin,
megafilmeshd50.com,
overflix.rip,
anitube.vip,
trecobox.com,
anitube.vip,
xpanimes.com,
flogão.com,
gofilmes.wf,
buscape.com,
flixmp4.com,
boxfilmes.to,
megafilmeshd.vc,
megafilmesgratishd.org,
osascoplaza.com,
imirante.com,
megafilmeshd.zone,
overflix.energy,
cinesecure.com,
letterboxd.com,
topflix.forex,
loveflix.click,
rjseries.art,
supertela.mov,
tinhte.vn,
ageleia.com,
overflix.vin,
.hashnode.dev,
cineflix.sensacinema.site,
boraflix.com,
cineroxy.com,
vizerhd.dog,

č,
g6u32nnp14de43.буриммк0л0дцы,
.рф,
fasovkamos.ru,

pinterest.,
elo7.com,
ims.com.br,
https://play.google.com,
https://versaodublada.com,
https://baskadia.com,
https://meucinema.org,
http://dublanet.com,
cosmicblu.com,
6vezes7.com,
cineart.com,
classicline.com,
.letras.,
www.folha,
.vagalume.,
https://entretetizei.com,
olhardigital.com,
tuaserie.to,
mediaflixhd.online,
startflix.vip,
cebolaverde.com,
gamerpoint.com,
nerdview.com,
jovemnerd.com,
nerdmaldito.com,
galaxianerd.com,
fortaleza.com,
shopping.com,
submarino.com,
.shopping,
cinemas.com,
papelpop.com,
atoupeira.com,
odiario.net,
.bbc.com,
g1.globo.com,
cnnbrasil.com,
jornadageek.com,
bytefurado.com,
cinema10.com,
thevore.com,
cineplayers.com,
cineship.com,
cinefilosparasempre.blogspot.com,
terra.com,
capricho.abril,
macmagazine.com,
cinematorio.com,
formigaeletrica.com,
replayoutv.com,
soundcloud.com,
mundoconectado.com,
otempo.com,
soupetropolis.com,
bolavip.com,
tudocelular.com,
filmaco.com,
revistaforum.com,
//revista,
//pipoca,
//papodecinema,
.downloadlivre.,
.fandom.com,
.forumeiros.com,
pergunta.com,
.correio,
.mundojurassicobr,
culturagenial.com,
.deficiente,
superinteressante,
exame.com,
geeksinaction.com,
filmelier.com,
megafilmeshdonline,
.prekschool.,
topico42.com,
acheicinema.com,
oficinadanet.com,
supercine.to,
//futebol,
//resenha,
.resenha,
nerdizmo.com,
univartes.com,
cartacapital.com,
iclinic.com,
telamix.net,
//veja.,
elpais.com,
themoviedb.org,
apostiladecinema.com,
interfilmes.com,
capcup.com,
capcut.com,
.cineteatro,
barbacenaonline.com,
centerplex.com,
metropoles.com,
.gazeta,
.poder360,
.royal,
ondever.com,
acnur.org,
.ufrg,
looke.com,
.org.br,
amazonaws.,
cinegarimpo.com,
bocadoinferno.com,
zainatrading.com,
guitarsnewyork.com,
austinprintcompany.com,
javiu.blog,
tourain.,
papodecinema.com,
pop.ng,
maioresemelhores.com,
news.tv,
pipoca3d.com,
dublagembrasileira.com,
vaidebolsa.com,
exibidor.com,
ultraverso.com,
reclameaqui.com,
ndvhkfijr,
cinevision2,
oneflix.one,
leiturafilmica.com,
hiperion.art,
playpilot.com,
airbnb.com,
sobresagas.com,
pequenajornalista.com,
timnews.com,
kotas.com,
oneplus.com,
gazeta.com,
cultureba.com,
aminoapps.com,
rumble.com,
walling.app,
kinoplex.com,
cinemas.nos,
cinepasseio.org,
cinebrasilia.com,
cinetorres.com,
opopular.com,
thirstymag.com,
dublagem-viva,
cevhertik.info,
cinesuperk.com,
cinevision-2.com,
suaserie.net,
assistirfilmeshdgratis.app,
redecanais.in,
weekseries.info,
overflix.mobi,
megafilmeshd.cc,
playseriesonline.co,
seriesflix3.to,
megacinetv.vip,
filmeflix.plus,
crunchyroll.com,
nickfilmes.net,
cafecomnerd.com,
queroseries.com,
universonintendo.com,
topflix.red,
topflix.band,
addons.mozilla.org,
pobre-tv.mx,
cinemais.com,
topmate.io,
filmeb.com,
20thcenturystudios.com,
comprenozet.com,
96fmbauru.com,
agendaitu.com,
pobre-tv.me,
parana10.com,
disneyplusbrasil.com,
artstation.com,
loveflix.love,
topflix.boats,
comandopode.com,
grupomobicine.com,
loucosporlivrosebo.wixsite.com,
leiturinha.com,
cinejardins.com,
cine14bis.com,
joaobracks.com,
chippu.com,
cinepanambi.com,
emdiaes.com,
radiomixfm,
cineshow.com,
designculture.com,
cinemilani.com,
sonypictures.com,
cinemulti.com,
torregeek.com,
tribunahoje.com,
campinas.com,
tropadercy.com,
overflix.llc,
topcineplex.com,
geekpopnews.com,
ouniversodatv.com,
mediaflix-1.com,
moviecom.com,
upnerd.com,
comandofilmes.com,
bento.me,
portala7.com,
testimonial.to,
canaltech.com,
circuitospcine.com,
megacine.click,
telecine.com.br,
mmfilmes.me,
ctaa.com,

[¡ASSISTIR!],
· Traduzir esta página,
l Trailer,
: Trailer,
| Trailer,
- Trailer,
› TV Shows,
› TV &,
› programacao,
› Posts,
› empauta,
› telemania,
› rar ›,
› artwork,
› sample,
› indie,
› web-stories,
› feedback,
› cinema,
› críticas,
› criticas,
› Cinema,
› Críticas,
› Criticas,
› agenda ›,
› coluna ›,
› imersao,
› bitstream ›,
› handle ›,
› noticia ›,
› audiovisual ›,
› artigo ›,
› article ›,
› magazine,
› docs ›,
› artigos ›,
› detalhe ›,
› dataset ›,
› integra ›,
› event,
› ovale,
› cidade ›,
› cultura ›,
› traducao ›,
› ultimas noticias,
› noticias cinema,
› noticia,
› notícia,
› noticias,
› noticías,
› Noticia,
› Notícia,
› Noticias,
› Noticías,
› abc ›,
› webstories ›,
› etc ›,
› geek,
› Geek,
› Thread,
› Galaxy-,
.pl ›,
trailer original -,
trailer oficial dublado -,
- trailer dublado -,
- trailer legendado -,
trailer oficial legendado -,

youtube ·,
YouTube ·,
Instagram ·,
instagram ·,
tiktok ·,
TikTok ·,

opensubtitles,
scribd.com,

cursos.com,

wikipedia.org,
wordpress.com,
pontofrio.com,

shopping,
mercadolivre.com,
amaricanas.com,
americanas.com.br,
olx.com,
extra.com.br,
shoptime.com,
https://shopee.com,
aliexpress.com,
vendaonline,
casasbahia.com,
magazineluiza.com,

linkedin.com,
github.com,

https://translate.google.com,

https://books.google.com,
scielo.org,

torrent,
dual áudio,
dvd,
blu ray,
baixarseriesmp4,

em exibição nos cinemas,
//cinema,
cartaz,
horário: ,
cinema -,
em cartaz,
hoje no cinema,
salas e horários,
comprar ingresso,
legendado. sala,
dublado. sala,
— sala,
dublado:,
legendado:,
3d dublado,
3d legendado,
2d dublado,
2d legendado,
x 2d,
x 3d,
- 2d -,
– 2D –,
- 3d -,
– 3D –,
horários. sala,
rede de cinemas,
ficha técnica:,

também perguntam,
pesquisas relacionadas,
sem título,
wiki -,

.usp.,
dominiopublico.,
pós-graduação,
prefeitura municipal,
jornal periscopio,
universidade estadual do,
universidade federal,
universidade estadual de,
escola politécnica,
//escola,
prefeitura de,
.educacao.,
diario.com,
.gov.br,
prefeitura do,
loja online de,
.iguatemi,
r$,
u$,
/produtos/,
/noticias/,
vendas-ia,
search`;



  setTimeout(function(){

    var url = window.location.href;

    // Verifica o URL para determinar o que fazer no site
    if (url.includes("google.com")) {

        function stringParaArray(xpalavrasChave) {
          const arrayDePalavras = xpalavrasChave.split(',');
          const palavrasLimparEspacos = arrayDePalavras
            .map(palavra => palavra.trim())
            .filter(palavra => palavra !== '');
          return palavrasLimparEspacos;
        }

        const palavrasChaveString = palavrasSalvas;
        const palavrasChave = stringParaArray(palavrasChaveString);

        // Função para verificar se uma palavra-chave está presente em um elemento
        function verificaPalavrasChave(elemento) {
          let texto = elemento.textContent.trim().toLowerCase();
          for (let i = 0; i < palavrasChave.length; i++) {
            let palavra = palavrasChave[i].trim().toLowerCase();
            if (texto.includes(palavra)) {
              return true;
            }else if(texto.includes("a") == false && texto.includes("e") == false && texto.includes("i") == false && texto.includes("o") == false && texto.includes("u") == false){
              return true;
            }
          }
          return false;
        }

        // Função para remover tags com base nas palavras-chave
        let ativatePX = false;
        function removeTagsComPalavrasChave() {
          if(ativatePX == true){
            let checarSubtags = document.querySelectorAll(".MjjYud");
            let inutils1 = document.querySelectorAll(".card-section");
            let inutils2 = document.querySelectorAll(".Lv2Cle");
            if(checarSubtags){
              checarSubtags.forEach(function (checarSubtag) {
                if (verificaPalavrasChave(checarSubtag)) {
                  console.log("...REMOVE...")
                  checarSubtag.remove();
                }
              });
            }
            if(inutils1){
              inutils1.forEach(function (checarNutils1) {
                let texto1 = checarNutils1.textContent.trim();
                if (texto1.includes("(DMCA)")) {
                  console.log("...Det...")
                  checarNutils1.remove();
                }
              });
            }
            if(inutils2){
              inutils2.forEach(function (checarNutils2) {
                let texto2 = checarNutils2.textContent.trim();
                  console.log("...Det...")
                  checarNutils2.remove();
              });
            }
          }
        }

        setInterval(removeTagsComPalavrasChave, 1000);


          var popup = document.createElement('div');
          popup.id = 'popupPX';
          popup.style.position = 'fixed';
          popup.style.top = '50%';
          popup.style.left = '50%';
          popup.style.transform = 'translate(-50%, -80%)';
          popup.style.padding = '20px';
          popup.style.background = '#fff';
          popup.style.border = '1px solid #ccc';
          popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
          popup.style.zIndex = '999999';
          popup.style.display = 'none';
          popup.style.border = 'solid 2px #d7d745';
          popup.style.backgroundColor = '#0b0c0d';
          popup.style.borderRadius = '8px';
          popup.style.height = '245px';
          popup.style.overflow = 'auto';

          var h4h4 = document.createElement('h4');
          h4h4.innerHTML = 'Estes são os melhores sites conhecidos para assistir online:';
          h4h4.style.margin = '7px auto';

          // Criar o botão de fechar
          var closeButton = document.createElement('span');
          closeButton.innerHTML = '×';
          closeButton.style.position = 'absolute';
          closeButton.style.top = '0px';
          closeButton.style.right = '0px';
          closeButton.style.cursor = 'pointer';
          closeButton.style.fontSize = '1.7rem';
          closeButton.style.padding = '0px 8px';

          closeButton.addEventListener('click', function() {
              document.getElementById("popupPX").style.display = "none";
          });

          // Adicionar o botão de fechar ao popup
          popup.appendChild(h4h4);
          popup.appendChild(closeButton);

          // Criar a lista de links
          var linkList = document.createElement('ul');

          // Adicionar links à lista
          var links = [
              { text: 'topflix.vc', url: 'https://topflix.vc/' },
              { text: 'hypeflix.club', url: 'https://hypeflix.club/' },
              { text: 'netcinetv.bz', url: 'https://netcinetv.bz/' },
              { text: 'playfilmes.live', url: 'https://playfilmes.live/' },
              { text: 'netcinetv.one', url: 'https://netcine.one/category/lancamentos/' },
              { text: 'topflixhd.life', url: 'https://topflixhd.life/category/ficcao-cientifica/' },
              { text: 'comandoplay.com', url: 'https://comandoplay.com/category/movies-2/' },
              { text: 'megafilmeshd50.zip', url: 'https://megafilmeshd50.zip/' },
              { text: 'filmeflixhd.com', url: 'https://filmeflixhd.com' },
              { text: 'redecanais.ps', url: 'https://redecanais.ps/' },
              { text: 'redecanais.ms', url: 'https://redecanais.ms/' },

              { text: 'meuseriado.cc', url: 'https://meuseriado.cc/' },
              { text: 'gofilmes.me', url: 'https://gofilmes.me/genero/ficcao-cientifica' },

              { text: 'embedder.net', url: 'https://embedder.net/lib/movies' },

              { text: 'animesdigital.org (ANIMES)', url: 'https://animesdigital.org/' },

              { text: 'dailymotion.com', url: 'https://www.dailymotion.com/search/dublado/videos' },
              { text: 'tokyvideo.com', url: 'https://www.tokyvideo.com/series/filmes-de-terror-dublado' },

              { text: 'overflixtv.one', url: 'https://overflixtv.one/' },
              { text: 'assistir.biz', url: 'https://assistir.biz/lista' },
              { text: 'maxseries.in', url: 'https://maxseries.in' },

              { text: 'vk.com/video', url: 'https://vk.com/video?q=dublado' },
              { text: 'ok.ru/video', url: 'https://ok.ru/video/' },
              { text: 'my.mail.ru/video', url: 'https://my.mail.ru/video/search?q=dublado' },
              // Adicione mais links conforme necessário
          ];

          // Iterar sobre os links e criar elementos de lista
          links.forEach(function(link) {
              var listItem = document.createElement('li');
              listItem.style.padding = '4px 2px';
              var anchor = document.createElement('a');
              anchor.href = link.url;
              anchor.textContent = link.text;
              anchor.style.padding = '4px 5px';
              anchor.style.fontSize = '1rem';
              anchor.target = '_blank';
              listItem.appendChild(anchor);
              linkList.appendChild(listItem);
          });

        // Adicionar a lista de links ao popup
        popup.appendChild(linkList);

        // Adicionar o popup ao corpo do documento
        document.body.appendChild(popup);


          var customDiv = document.createElement('div');
          customDiv.style.width = 'auto';
          customDiv.style.position = 'fixed';
          customDiv.style.top = '10.5%';
          customDiv.style.left = '1%';
          customDiv.style.height = '60px';
          customDiv.style.marginTop = '5px';
          customDiv.style.textAlign = 'center';
          customDiv.style.padding = '5px';
          customDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

          // Criar elemento img
          var imgElement = document.createElement('img');
          imgElement.title = 'Abrir lista de bons sites';
          imgElement.src = 'https://static.wikia.nocookie.net/hero-tale-idle-rpg/images/f/f8/Pirate_Coin_icon.png/revision/latest/thumbnail/width/360/height/360?cb=20210712122314';
          imgElement.style.width = '35px';
          imgElement.style.margin = '0px auto';
          imgElement.addEventListener('click', function() {
              document.getElementById("popupPX").style.display = "inherit";
          });

          // Criar elemento label
          var labelElement = document.createElement('label');
          labelElement.title = 'Ativa/Desativa Filtragem';
          labelElement.className = 'switch';

          // Criar elemento input dentro do label
          var inputElement = document.createElement('input');
          inputElement.type = 'checkbox';
          inputElement.id = 'toggleExtensao';

          // Criar elemento span dentro do label
          var spanElement = document.createElement('span');
          spanElement.className = 'slider';

          // Adicionar input e span ao label
          labelElement.appendChild(inputElement);
          labelElement.appendChild(spanElement);

          // Criar elemento p
          var pElement = document.createElement('p');
          pElement.style.padding = '0px';
          pElement.style.margin = '2px auto';
          pElement.style.textAlign = 'center';

          // Adicionar texto ao p
          pElement.innerHTML = '<b>Piratinha (<span id="statusp">off</span> )</b>';

          // Adicionar elementos à div
          customDiv.appendChild(imgElement);
          customDiv.appendChild(labelElement);
          customDiv.appendChild(pElement);


        document.body.appendChild(customDiv);


      var xyz = document.createElement('style');
       xyz.innerHTML = `
          /* Estilize o controle de alternância (botão de liga/desliga) */
        .switch {
          display: inline-block;
          position: relative;
          width: 30px;
          height: 15px;
          margin: 10px 5px;
        }

        .switch .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 14px;
        }

        .switch .slider::before {
          position: absolute;
          content: "";
          height: 13px;
          width: 13px;
          left: 2px;
          bottom: 1px;
          background-color: #2e4b77;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 50%;
        }
        input[type="checkbox"] {
          display: none;
        }
        input[type="checkbox"]:checked + .slider::before {
          -webkit-transform: translateX(13px);
          -ms-transform: translateX(13px);
          transform: translateX(13px);
          background-color: #3772cc;
        }`;

        document.body.appendChild(xyz);


        // Salva o status on/off
        document.getElementById('toggleExtensao').addEventListener('change', function() {
          const estadoExtensao = this.checked;
          if (this.checked) {
            ativatePX = true;
            GM_setValue("statusPirata", true);
            document.getElementById('statusp').innerHTML = "on";
          } else {
            ativatePX = false;
            GM_setValue("statusPirata", false);
            document.getElementById('statusp').innerHTML = "off";
            window.location.reload();
          }
        });

        function carregarPiratinhaStatus() {
            const statusPX = GM_getValue("statusPirata");

            if (statusPX) {
                document.getElementById('toggleExtensao').checked = statusPX;
              if(GM_getValue("statusPirata") == true){
                document.getElementById('statusp').innerHTML = "on";
                ativatePX = true;
              }
            }else{
               GM_setValue("statusPirata", false);
               document.getElementById('statusp').innerHTML = "off";
               ativatePX = false;
            }
        }

        carregarPiratinhaStatus();

    } else if (url.includes("embed.embedplayer.site")) {
        //alert("OOOK")
        const palavrasNaLista = ['mdzsmutpcvykb', 'embed'];
        let openLink = '';
            setTimeout(function(){
            // Seletor para localizar todos os iframes na página
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                const src = iframe.getAttribute('src');
                const palavraEncontrada = palavrasNaLista.some(palavra => src.includes(palavra));
                if (src && palavraEncontrada) {
                    openLink = src;
                }
            });
            //alert(openLink);
            window.open(openLink, '_blank');
          },1500);

    }else if (url.includes("embedplayer.online")) {
        setTimeout(function(){
            // Seletor para remover autopromoção de app no player
            let inconveniente = document.querySelector('.jw-logo.jw-logo-bottom-left.jw-reset');
            if(inconveniente){
              inconveniente.style.display = 'none';
            }
          //alert("ok");
        },1500);
    } else if (url.includes("gofilmes.me")) {

      const palavrasNaLista = ['mdzsmutpcvykb', 'gofilmes.me/play'];
      function iframePiratinha(){
            setTimeout(function(){
            // Seletor para localizar todos os iframes na página
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                const src = iframe.getAttribute('src');
                const palavraEncontrada = palavrasNaLista.some(palavra => src.includes(palavra));

                if (src && palavraEncontrada) {
                    // Substitui o iframe com os parâmetros desejados
                    const novoIframe = document.createElement('iframe');
                    novoIframe.src = src;
                    novoIframe.setAttribute('webkitallowfullscreen', '');
                    novoIframe.setAttribute('mozallowfullscreen', '');
                    novoIframe.setAttribute('remote', '');
                    novoIframe.setAttribute('frameborder', '0');
                    novoIframe.setAttribute('scrolling', 'no');
                    novoIframe.setAttribute('seamless', 'seamless');
                    novoIframe.setAttribute('msallowfullscreen', '');
                    novoIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                    novoIframe.setAttribute('referrerpolicy', 'no-referrer');
                    novoIframe.setAttribute('async', '');
                    novoIframe.setAttribute('allowfullscreen', '');

                    // Substitui o iframe antigo pelo novo
                    iframe.parentNode.replaceChild(novoIframe, iframe);
                }
            });
          },3200);
        }

        setTimeout(function(){
          if(document.querySelector('.links')){
            const elementosComClasseItem = document.querySelectorAll('.links');
            elementosComClasseItem.forEach(elemento => {
                elemento.addEventListener('click', function () {
                    iframePiratinha()
                });
            });
            document.querySelector(".links").innerHTML += `<p style="text-align:center;padding:10px 2px;color:#fff;"><b style="color:#f1ff4f">★</b> O <b>Piratinha</b> fez ajustes para impedir propagandas.</p>`;
          }
        },1200);

    }else {
        console.log("Site desconhecido.");
    }

  },3500)

})();