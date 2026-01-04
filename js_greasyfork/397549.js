// ==UserScript==
// @name        Hotfiles Antimanele
// @namespace   drakulaboy 2020
// @version     2020.13.04
// @description Ascunde rahatul, am cules baza de date cu numele ratatilor vreo doua zile
// @author      drakulaboy
// @license     MIT
// @include     *hotfiles*
// @downloadURL https://update.greasyfork.org/scripts/397549/Hotfiles%20Antimanele.user.js
// @updateURL https://update.greasyfork.org/scripts/397549/Hotfiles%20Antimanele.meta.js
// ==/UserScript==


(function() {

	const DEBUGGING = 0;

	const filters = {
		'AntiManele': /ada\sde\sla\stimisoara|adrian\sc\.m|narcis|adi\sarmeanu|adrian\sde\sla|florinel\s|adi\sbengosu|adi\sbihoi|adi\scampean|adi\scaval|adi\sde\sadi|adi\sde\sla|adi\sde\svito|adi\senache|adi\sminune|adi\smunteanu|adi\spela|adi\spopescu|adi\ste\samo|adita\salbanezu|adrian\scaval|adrian\scoada|adrian\scopilu\sminune|adrian\scopilul\sminune|adrian\sdasu|adrian\sde\sla\sseverin|adrian\sjunioru|adrian\sleucuta|adrian\sminune|adrian\spustiu|adrian\spustiulika|adrian\sraducanu|adrian\srigu|adriana\sdrenea|adriana\spopescu|adriana\sstuparu|adriano|ady\samar|ady\sivan|ady\spustiu|ady\sspaniolu|adytza|ahmed\sde\sla\sploiesti|alberto|alberto\sbratianu|alberto\sbriliantu|alberto\sde\sla|alberto\sprintu|alberto\sprintzu|alesis|alessio|alessio\smarco|alex\sarmeanca|alex\sban|alex\sbotea|alex\sbraileanu|alex\sde\sla|alex\sdin\saparatori|alex\sdin\ssalaj|alex\sduet|alex\sdules|alex\sg|alex\sg.|alex\sjidanu|alex\skojo|alex\slipovan|alex\smadalin|alex\smladin|alex\spustiu|alex\ssavu|alex\ssultan|alex\stalent|alex\stutu|alex\suraganu|alex\svidrascu|alexandra\sbuburuzan|alexandra\sde\sla\sconstanta|alexandra\sgeva|alexandru\sbradatan|ali\ssultanul|ali\szaid|alin\sblondu'|alin\sde\sla|alin\sdevis|alin\sdiamantul|alin\sdragu|alin\sduma|nicu\selvis|alin\shabaci|alin\sprintu|alin\spustanu|alin\sstoica|alina\sbebe\ssandulescu\sbebe|alina\sbumbes|alina\sde\sla\sorastie|alina\sradi|alinu\sa.j|alinu\saj|alisia|all\sstars|ally\spustiu|aly\sploiesteanu|aly\sstan|aly\ssultanul|amalia\sursu|ana\siancu|ana\smaria\sgoga|anamaria|anca\smihaila|ancuta\sanghel|ancuta\scorlatan|andrada|andrea\sft\scost\sionita|andrea\sft.costi|andreea\sft\scost\sionita|andreea\shaisan|andreea\stodor|andrei|andrei\sartistul|andrei\sbrinasi|andrei\sciote|andrei\sde\sla|andrei\sdespa|andres|andrey|andrey\sde\sla\sbaia\smare|angela\srusu|angelica\sflutur|angelly|anghel\sturcu|animat\splanet|anka|antique|antonio|antonio\sanakonda|antonio\sminune|arabeasca|arabu|arabu\sde\sla\scluj|aramis|artistul|arun\sde\sla\sbarbulesti|attila\sploiesteanu|augustin|aurel\sband|aurel\sde\sla\sbobesti|aurel\seuropeanu|aurel\smoldoveanu|aurelian\sde\sla\sorastie|aurelian\snitu|axinte|ayan|ayda|azis|b\sfarcas\ss\sferi\sde\sla\sfrankfurt|b\spiticu|b.\sfarcas|b.\spiticu|b.piticu|b.piticu\scu\smariano|babanu|babi\sminune|baby\sminune|bairam|bambo|beatrice\sde\sla\svenezia|bebe\sde\sla\sconstanta|beni\samericanu|benone\sursaru|beny\samericanu|berty|beto\sadam|bg.d|bianca\sminea|bibi\sprintul|biju|biliana|bio\sbio|blaga\sde\sla\soradea|blondu\sde\sla\stimisoara|blondu\sdela\stimisoara|boanta|bobby\srostas|boby|bodgan\sde\sla\scluj|bodo|bogdan\sartistu|bogdan\scopilu|bogdan\sde\sla|bogdan\sdod|bogdan\sfarcas|bogdan\sgavris|bogdan\spiticu|bogdan\sungureanu|bogdanel\sde\sla\sploiesti|bombonel\scotoc|borex\sde\sla\siasi|brandy|brazilianu|briana|buji\stalent|bulgarii|bursuc\sde\sla\scalarasi|bursuc\spiticu|bya\sdidem|calin\sbrateanu|calin\scrisan|calin\stoader|camelia\sgrozav|camelia\smiutescu|cami\sde\sla\sdeva|cami\smiutescu|canibali\sde\sla\sploiesti|carmen\sde\sla\sroma|carmen\sde\sla\ssalciua|carmen\sdobre|carmen\sjula|carmen\sserban|casano|cata\sboss|cata\sviss|catalin\sarabu|catalin\sblondu|catalin\sbuzoianu|catalin\sde\sla|catalin\smira|catalin\sploiesteanu|catalin\sprinty\snistor|catalin\sromanu|catalin\svlad|cauciuc\sde\sla\sbuzau|cercel|cezarica\sdin\sbuzau|cheful\sprimaverii|cipri\sde\sla\sblaj|cipri\spopescu|ciprian\sbalint|ciprian\sbela|ciprian\sbuzitza|ciprian\scret|ciprian\sde\sla\sbistrita|ciprian\sfermecatoru|ciprian\smicsa|ciprian\snegrut|ciprian\spopa|ciprian\ssentiment|ciprian\stepeliga|claudia\sionas|claudia\sshik|claudita|claudita\sde\sla|claudiu|claudiu\salecu|claudiu\sborza|claudiu\scalipso|claudiu\scalypso|claudiu\sdaniel|claudiu\sde\sla\sroma|claudiu\sduet|claudiu\senergie|claudiu\sstf|claudiu\stalent|claudiu\stoma|constantin\sbahrin|copil\stalentat|copilu\sde\saur|copilu\sminune|copilu\svagabond|copilu\svagabont|copilul\sde\saur|copilul\snorocos|corina\sbocsa|cornel\scojocaru|cornel\sde\sla\sconstanta|cornel\spopovici|cosmin\sciorogaru|cosmin\sde\sla\sbacau|cosmin\sde\sla\stimisoara|cosmin\sserfezeu|costel\sbijiu|costel\sbiju|costel\sboro|costel\sciofu|costel\sde\sla\sbolentin|costel\sdinu|costel\sgeambasu|costel\shantu|costel\spustiu|costelinio|costelus\sde\sla|costi|costi\sde\sla\stimisoara|costi\sionita|costi\sionita\sft.\soana|costi\stenerife|costica\sal\svostru|costica\sboieru|costica\sde\sla\sploiesti|costle\sbiju|costy\sde\sla\sploiesti|crina\shorincar|crina\sogica|crisscen|cristi\sbanateanu|cristi\sblaga|cristi\sbratara|cristi\sde\sla|cristi\sde\sla\sploiesti|cristi\sdin\sbanat|cristi\sdorel|cristi\sdules|cristi\sfarcas|cristi\sganta|cristi\shaidin|cristi\skikos|cristi\smecea|cristi\smega|cristi\smihai|cristi\smunteanu|cristi\snova|cristi\snuca|cristi\spustiu|cristi\srizescu|cristi\stiran|cristi\svintila|cristian\sde\sla\scraiova|cristian\sharhata\sft.\sdan\sjunioru|cristian\slondonezu|cristian\srizescu|cristiano|cristinel|cryss\sstyle|culita\ssterp|dacian\sde\sla\soradea|dalida|damany|dan\sanghel\sde\sla\scraiova|dan\sarabu|dan\sarghira|dan\sarmeanca|dan\sbarbu|dan\sbursuc|dan\sciotoi|dan\sdraghici|dan\sjunioru|dan\skirica|dan\skirika|dan\sneacsu|dan\snistor|dan\sparfum|dan\spitic|dan\spitigoi|dan\srizescu|dan\ssalam|dan\ssultanu|dana\sdance|dana\sde\sla\svictoria|dana\sdobre|dana\sradneantu|danezu|dani\sbanateanu|dani\smocanu|dani\sprintul\sbanatului|dani\ssfantul|daniel\schinezu|daniel\sde\sla|daniel\sfinutzu|daniel\sgyorfi|daniel\skinezu|daniel\slive|daniel\sminune|daniela|daniela\scraciun|daniela\sgheorfi|daniela\sgyorfi|daniela\sgyorfy|daniela\ssafta|danut\sarcan|danut\sardeleanu|danut\sbabanu|danut\sde\svito|danut\siuga|danut\spustiu|danut\sviorel|dany\sde\sla|dany\sstan|dany\sstan\sde\sla\svalcea|danya|darius|darius\sde\sla\soradea|darius\sduet|david\sde\sla\sploiesti|david\skampionu|david\soscar|de\smarco|deejay\sscandura|delia\sde\sla\soradea|demarco|demariano|denaur\spustiu|denis\sde\sla\sploiesti|denis\sdobre|denis\sgeoargian|denis\sramniceanu|denisa|denisa\sbotis|denisa\smirisan|denisa\spopa|denisa\spopovici|denisa\sprintesa|denisa\ssarboaica|desanto|diana\sionita|dina\svararean|dinescu|dingo\sasan\sbaba|distroficu|dj\salexis|dj\saly|dj\salynush|dj\sbengos|dj\scostin|dj\sdeddy|dj\sexu|dj\sgrosuu|dj\slbm|dj\slyvyo|dj\snardy|dj\snardy\smarinescu|dj\ssanto|dj\ssaracu\sstuttgart|dj\ssebi|dj\sseby|dj\sshadow|dj\sshydo|dj\svalentino\s|djcristy\slive\smix|djkody|djoni|dochia\sbanda|dodo|don\sgenove|don\snero|dorel|dorel\schinezu|dorel\sde\sla|dorel\spascu|dorel\ssavu|dorel\stalent|dorian\sarabu|dorin\scovaci|doru\sarmeanca|doru\scolumbianu|doru\sde\sla|doru\sgura\sde\saur\sde\sla\sploiesti|doru\stranca|dumi\sprintu|dumitra\sbengescu|eduard\sde\sla\sroma|edvin\seddy|edy\stalent|edytalent|elegance|elena\sde\sla\szaragoza|elena\spamfiloiu|elgi|elis\sarmeanca|eliza|elvis|elvisano|elvit|emil\sde\sla\sploiesti|emilia\sghinescu|emilija|emy\sde\sla\sfocsani|englezu|enzo\sarmeanca|eugen\sde\sla\scorabia|evanda|evanda\sde\sla\stimisoara|evanda\sdin\stimisoara|f.salam|fane\sdumitrache|fantastic\sdin\smizil|fara\sde\sla\smedias|fata\smorgana|felicia\sde\sla\stimisoara|feraru\sde\sla\sbuzau|fernando\sde\sla\scaransebes|fero|ferro|fery|fery\sde\sla\scluj|fery\sde\sla\sfrankfurt|flavy\sminune|floorin\sursaru|florentin\sleonard|florentina\salexandra\smartin|florentina\sraicu|florin\sbaboi|florin\sbaiazid|florin\sbordeanu|florin\sbordeianu|florin\scercel|florin\scrisan|florin\scristea|florin\sde\sla|florin\sdiablo|florin\sdin\sberceni|florin\sdinca|florin\sdodo|florin\sfermecatoru|florin\sfermecatu|florin\sgherlea|florin\sminune|florin\smitroi|florin\smocanas|florin\sosanu|florin\sosanu'|florin\speste|florin\spurice|florin\ssalam|florin\stalent|florin\stanase|florin\stranca|florin\sturcu|florin\sursaru|florin\svos|florinel\scu\sioana|florinel\sde\sla\spadova|florinel\sioana|florinel\svs\sraggaman|florinut\sde\sla\scluj|florita\sde\sla\sclejani|flroin\ssalam|fratii\scocos|fratii\scrisan|fratii\sde\saur|fratii\sde\saur\slive\sin\sstudio|fratii\sieseni|fratii\speste|fratii\sreut|fratii\ssalam|fratii\stepeliga|fratii\sturcitu|fuego|gabi\sandrei|gabi\sbec|gabi\sde\sla\sbuzau|gabi\sde\sla\sciupelnita|gabi\sde\sla\sdorna|gabi\sde\sla\soradea|gabi\sdin\sgiulesti|gabi\sgheorghe|gabi\slunca|gabi\sturcoaica\sde\sla\sploiesti|gabita\sde\sla\sbuzau|gabita\sde\sla\scraiova|gabita\szeta|gabriela|gabriela\sbolundut|gabriela\sneag|gabriela\snistor|gabriela\sstanciu|gaby\sde\sla\spitesti|gaby\sdin\sgiulesti|gaby\skapota|galena|gashka|gashka\sft\scamy|gazi\sdemirel|geani\sde\sla\slondra|geany\scrazy|geany\smorandi|geo\sde\sla\sbrasov|geo\sgeovani|geo\sgiovani|geo\sgiovanni|geo\sgiovany|geo\sno1|geo\spustiu|george\sbaiatul|george\sda\sla|george\sdin\sberceni|george\sdin\smilitari|george\sgeru|george\slican|george\sparfum|george\stalent|georgiana|georgiana\sde\sla\sclejani|georgica|georginel\sdin\scaciulati|gerard\sinima\sde\sleu|ghiran\sjr\.|ghiran\sjunior|ghita\sadriano|ghita\sberinde|ghita\smunteanu|gicu\schiran|gicuta|gicuta\sdin\saparatori|gicuta\spustiu|gigi\sbecali|gigi\sde\sla\sroma|giguta\sdin\saparatori|gili\sde\sla\sbobesti|gina\slincan|giorgiana\sde\sla\stimisoara|giovanny\sgrandiossu|gipsy\scasual|gipsy\sstars|giulio|giulio\sargintaru|godici|goe\sdin\stei|gogu\sbursuc|goran|grigore\sgherman|grosu\sdaniel|guta|gyo|gypsy\scasual|gyuliano|gyuliano\sparno|haifa|hamude|hore\ssarbe\spinguinul|husnu\ssenlendirici|hussein\sal\sjasmi|ianis\seuropeanu|ibrahim\statlises|ileana\sciuculete|iliuta\sbumbes|iliuta\sbumbes\s|iliuta\sde\sla\sbals|ilye\selvetianu|instrumentala\sformatia|intre\s2\snu\ste\sploua\s2oo9\s[promo\salbum]|ion\sartur|ionatan|ionel\schioveanu|ionel\sflorea|ionel\sienciu|ionela\spascu|ionica\sardeleanu|ionica\sminune|ionica\sminune\s2018|ionica\smorosanu|ionita\sde\sla\sclejeani|ionut\salbu|ionut\salecu|ionut\sarmeanu|ionut\sblondu|ionut\scercel|ionut\scrampei|ionut\scrampei\sclaudiu\salecu|ionut\sde\sla|ionut\sdin\schitila|ionut\seduardo|ionut\sene|ionut\sflorea|ionut\sflorescu|ionut\sfrumuselu|ionut\smanelistu|ionut\smititelu|ionut\smosu|ionut\snemes|ionut\spandelescu|ionut\spascu|ionut\sprintu|ionut\sprintul|ionut\spustiu|ionut\sserb|ionut\sspaniolu|ionut\ssturzea|ionut\ssystem|ionut\strandafir|ionut\svaloare|irina\slepa|irina\sloghin|iulan\spuiu|iulia\siavoriszki|iulian\sde\sla\sbacau|iulian\sdumitrache|iulian\sgrigoras|iulian\snorocosu|iulian\snorocosul|iulian\spuiu|iuly\sneamtu|iuly\sneamtzu|ive\smargherita\sde\sla\sclejani|ivena|izabela|jacksona|jador|jan\sde\sla\scraiova|jazzline|jean\sde\scraiova|jean\sde\sla|jida\sdinulovici|jmenu|jona\sbalint|juke\scopilu\sminune|juke\scopilul\sminune|kaba\sdens|kata\sfrancezu|katalin\sde\sla\sbuzau|katus|katy\sde\sla\sbuzau|kempes|kenan\sde\sla\sploiesti|kenzo|khinjo|kristian\sprintul|kristiana|kristiyana|kristyana|kristyiana|kromatic\sjunior|krystyana|ktalin\sgirona|lady\saura|laura\solteanu|laura\svass|laurentiu\scraciun|laurentiu\skenzo|lavinia\sgoste|lavinia\snegrea|lele\scraciunescu|lena\smiclaus|lenna|leo\sde\sla|leo\sde\svis|leo\sdura|leo\snorocosu|leonard|leonard\sde\sla\sbuzau|leonard\sserban|leonard\svijelie|lili\sde\sla|lili\shantzu|liliana\sciotoi|liliana\stodea|liliana\sursachi|live\sformatia|liviu\sciotoi|liviu\sguta|liviu\sionita|liviu\smititelu|liviu\smititelul|liviu\spustiu|liviu\spustiu'|liviutz\sde\sla\stimisoara|lorena|lorenna|lorenzoo|lorenzzo|loti|lotus\smarghita|luci\sanne|luci\sdiamantul|luci\sseres|lucia\sseres|lucian\samericanu|lucian\scojocaru|lucian\sde\sla\soradea|lucian\sdragan|lucian\selgi|lucian\sprintu|lucian\sseres|lucian\szadic|luciano|lucione|ludovic\srespekt|ludovik\srespekt|luminita\spauliuc|luminita\spuscas|lusu|lusu\sde\sla\sdeva|olandezu|madalin\sde\sla\schirnogi|madalin\sgicuta|madalin\sscripcaru|madalin\stalent|madalina|madalina\sbeyonce|madalina\smanolache|madi\ssalam\sde\sla\sslatina|maestrul\scocos|maldini|malyna|manas|manu|manu\sjr|manu\stargovisteanu|marcel\sde\sla\srosu|marcel\svarodi|margel\spintea|margherita\sde\sla\sclejani|margherita\sdin\sclejani|mari\sbaboi|mari\sde\sla\sbrasov|marian\sbudeaua|marian\sde\sla|marian\shulpus|marian\sjaponezu|marian\smarokanu|marian\smexicanu|marian\spavel|marian\spiticu|marian\ssavoiu|marian\suniversalu|marian\sunversalu|marian\sv1p|mariana\sbalan|mariana\sdobzeu|mariano|marilena|marin\smoghoi|marin\smogoi|marina|marina\sde\sla\sroma|marina\snuca|marinela\sivan|marinica\sde\sla\sfoisor|marinica\smamol|marinica\snamol|marinica\snamol\s2015\slive|marinica\snamol\sinstrumentala\s2\slive\s2015|marinus\sde\sla\sploiesti|mario\sbarac|mario\sbratianu|mario\sbuzoianu|mario\sbuzoianu\s&teodora\sbarsan|mario\sciubotaru|mario\sde\sla\sbaia\smare|mario\sdin\sferentari|mario\sstan|marioara\starziu|marius|marius\sbabanu|marius\sbabanui|marius\sbaldovin|marius\sbaldovin&\siliuta\sbumbes|marius\sdaju|marius\sde\sla|marius\sdragomir|marius\sfurnica|marius\sghigeanu|marius\slautaru|marius\smanix|marius\solandezu|marius\sprintul\sgorjului|marius\ssali|marius\stalent|marius\stalent\slive|marius\stepeliga|marius\strif|marius\szepelin|marius\szgaianu|maru|maru\sdin\schitila|marusca|maruska|maruta|mary\sde\sla\sgalati|mary\spustiul|mary\stalent|max\stimis|mc\smasu|megamix\smanele\sdisco\s|memetel|mihaela|mihaela\sbelciu|mihaela\sde\sla\svalcea|mihaela\siancu|mihaela\sminune|mihaela\sorbulov|mihaela\sstaicu|mihai\sandrei|mihai\senescu|mihai\sgheban|mihai\slautaru|mihai\spiticu|mihai\spriescu|mihai\sradu|mihai\ssicoe|mihai\straistariu|mihaita\sarmeanca|mihaita\sciocoi|mihaita\sdin\sberceni|mihaita\sfatu|mihaita\spiticu|mihaita\stoma|miki\scortan|mili\sde\sla\stimisioara|minodora|miraj\stsunami|miraj\stzunami|mircea\sde\sla\sploiesti|mircea\smondialu|mirela\snitu|mirela\sparaleu|mirela\spetrean|miron\sfratila|mister\sdin\ssatu\smare|mita\sde\sla|mita\sinternationalul|mitroi\sde\sla\scluj|mitzu\sdin\ssalaj|monica\slupsa|mr\sjuve|mr.\sjo|mr.\sjuve|mr.juve|mrius\sde\sla\sfocsani|mugurel\sdodea|n.guta|nana\sdinu|nancy\sajram|narcis\sde\sla\sbarbulesti|narcisa|nea\skalu|nea\ssandu|nek|nelu\sde\sla\scraiova|nelu\snicolae|nelut\speste|neluta\sbucur|nelutu|nelutu\sde\sla\sbrasov|nelutu\speste|nelutu\ssalam|nemuritorii|nero\selveziano|nicky\sft\siuliana|nicky\syaya|nicoale\sguta|nicolae\scretu|nicolae\sraceanu|nicolaie\sguta|nicolas\salin|nicolas\solandezu|nicoleta\sbuga|nicoleta\sceaunica|nicoleta\sguta|nicoleta\sguta\scalin\scrisan|nicoleta\skapital|nicoleta\svlasici|nicu\salbu|nicu\sboieru|nicu\sbratianu|nicu\scioanca|nicu\scionca|nicu\sdavid|nicu\selvis|nicu\sguta|nicu\snetea|nicu\spaleru|nicu\spaleru\svs\sdj\slevel|nicu\ssalam|nicu\steisanu|nicu\steisanu\sjr|nicu\svesa|niculae\sde\sla\sclejani|nicusor\sboieru|nicusor\scopilu\sde\sla\sbuzau|nicusor\sde\sla\salba|nicusor\sde\sla\sbuzau|nicusor\sgioconda|nicusor\sguta|nicusor\smosu|nicusor\spascu|nicusor\sprintu|nicusor\stalent|nicusor\stunea|nicusor\svulcanul|nikolas|nikolas\solandezu|nikolas\ssax|nikos|niky\sft.johnny|ninel\sbraila|ninel\sde\sla|nyno\sescobar|nyny|oaca\sde\sla\scraiova|oana\smiron|octavia\shetea|octavian\sfrancezu|olimpia\szica|oliver\sfera|oneata\sde\sla\scaracal|orchestra\smagnificii|orchestra\smarius\sbabanu|orlando|ovidiu\sde\sla\salba|ovidiu\spas|ovidiu\srusu|pablo\sde\sla\stimisoara|paduraru|papaie|papie|parodia\slui\sversace|parodie\smanea|parvulet|pasol|paul\sfantezie|paul\sstanga|pavel\segidio|pelle|petq|petrica\sbanateanu|petrica\scercel|petrica\sprintu|petrica\sprintul|petrice\scercel|petruta|pindu|piratii\sdunarii|piti\stalent|piticu\sde\sla\stimisoara|piticu\stimisoara|pitzy\sde\sla\sconstanta|plagiat\snancy\sajram|play\saj|pokemon\sband|poli\spaskova|preslava|priescu|printesa\sardealului|printesa\sde\saur|printesa\ssamira|printesele\smoldovei|printu\sde\sla\scluj|printul\sde\sla\scluj|puisor\sde\sla\smedias|puiu\scodreanu|puiu\sfagarasanu|puiu\sghiera|pustanu\slui\snyno|pustanul\slui\snyno|pytu\sde\sla\sdragasani|radu\sarcalean|raducu\sde\sla\sploiesti|rafy\sswiss|raluca\sdragoi|ramona|ramona\svasiu|ramzi|raoul\spustiu|razvan\sde\sla|razvan\sdragos|rebeca\sminune|rechinii\sdin\soltenita|relu\spustiu|remus\sde\sla\soradea|renata|rico\snadara|rico\spustiu|rikian|robby|robby\sde\sla\spopesti|robeeo|robert\sde\sla\sparis|robert\sde\sla\sslatina|robert\sdin\saparatori|robert\sflorin|robert\sjunyoru|robert\ssalam|robert\stavaga|roby\sartistu|roby\sde\sla\spopesti|rodica|rodica\solariu|romania\stoata\spetrece|romeo|romeo\sbanateanu|romeo\sde\sla|romeo\sfantastic|romeo\sfantastick|romeo\sfantastik|romeo\snamol\sjr.|romeo\studorache|romica\sde\sla\spitesti|romica\sdin\saparatori|romica\sduet|romulus\sde\sla\shuedin|romy|roni\spustiu|roson\smusic\sband|roxana\silisie\sperian|roxana\sprintesa\sardealului|roxelana|roxy\smanelista|ruby\sploiesteanu|rudi\sde\sla\svalcea|rudi\spitesteanu|rudy\sde\sla\svalcea|rudy\sploiesteanu|rudy\sploiesteanul|rukmini|rumbi\sde\sla\sbuzau|rumby\sde\sla\sbuzau|rusu\sde\sla\soradea|ryan\smejor|sabina\sleonte|salam|sami\ssuzan|samia|samir|sandel\sminunatu|sandel\spiticu|sandra\sde\sla\snegresti|sandu\sciorba|sandu\svijelie|sanziana\stoader|sava\snegrean\sbrudascu|sebastian\siuga|sebi\sde\sla|sebi\siuga|seby|selciuc\sturcu|sercin\sde\sla\sconstanta|sergiu\sardeleanu|sergiu\sde\sla\ssibiu|setrak\ssarkissian|shaban\sregele\sdin\sbanat|shusanu|sica\sde\sla\scalarasi|sica\snorocel|sile\selis|silva\spetrovici|silvian\sbursuc|simi\sbelea|simona\sboncut|simona\scalota|simona\sstefanoiu|simona\steodorescu|slavi\sand\smiro|sokeres|sonia\sferrari|sonia\sratiu|sonor\salexandria|sonor\sdin\salexandria|sorin\scapitanescu|sorin\scopilu\sde\saur|sorin\scopilul\sde\saur|sorin\sdanulet|sorin\snecunoscutu`|sorin\sparfum|sorin\stalent|sorina\sceugea|sorina\sonetiu|sorine\spustiu|sorinel\scopilu\sde\saur|sorinel\scopilul\sde\saur|sorinel\sde\sla\splopeni|sorinel\sde\sla\splopeni\sband|sorinel\spustiu|sorinel\spustiul|spidi\sconstanteanu|stana\sizbasa|stefan\saventura|stefan\sde\sla|stefy\spustiu|stelele\sromaniei|stelian\sde\sla\sturda|stelica\spustiu|stellica\spustiu|stelu\sde\sla\sploiesti|stelyan\sde\sla\sturda|suraj\sde\sla\sbarcelona|susanu|susanu\s[album\sfoto]|susanu\sx\snicolae\sguta|tanca\suraganu|tani\spetry|tanja\ssavic|tanya\sboeva|taraful\shaiducilor|tavi\sde\sla\snegresti|teodora\sbarsan|tibishor\sgheza|tibisor\sgheza|ticy|tinel|tinu\sveresezan|tinu\sveresezean|tinu\sverezesan|toni\sciolac|toni\sde\sla\sbrasov|tony\sbahu|tony\sde\sla|tony\ssalam|trupa\slu|trupa\slui|ttriton|tudor\scioara|tzanca\sde\sla\sploiesti|tzanca\suraganu|tzanca\suraganul|tzontzo\sindianul|tzubi|valencio|valentina|valentina\skristi|vali\sbanica|vali\sbirlic|vali\sbulgaru|vali\sbulgrau|vali\sciubotaru|vali\scobzaru|vali\sde\sla\sgiurgiu|vali\sde\sla\sploiesti|vali\sde\sploiesti|vali\sfrangu|vali\sg|vali\sg.|vali\slucan|vali\spitic|vali\svijelie|vali\svijelie&kristiyana|valy\sde\sla|valy\sfantezie|varu\ssandel|vasile\sarmeanca|vasile\smucea|vasile\szidaru|vasilica\sploiesteanu|verdy\sde\sla\svalcea|veva\sband|vik\sbratianu|vio\sde\sla\sdeva|violeta\sconstantin|violeta\slumina\svestului|vionelia\sbaluse|viorel\sdanut|viorel\sde\sla\sconstanta|viorel\spustiu|viorica\sde\sla|vitalis|vladut\sde\sla\sblaj|vladut\smiracol|vladuta\slupau|voetin|willy\sde\sla\soradea|yadel|yana|yanis|yanne\syanne|yoanne|yonut\scercel|yonutz\scercel|yosoy|zacu|zaku|zenys/iu,
	};

	const commonCss = `
		.filter-status {
			margin-left: 6px;
		}

		.filter-switches {
			display: none;
		}

		:hover>.filter-switches {
			display: block;
		}

		.filter-on,
		.filter-off {
			display: block;
			width: 97px;
		}

		.filter-switches a {
			text-decoration: none;
			color: inherit;
			cursor: pointer;
		}

		.filter-switches a {
			margin-left: 8px;
			padding: 0 4px;
		}

		a.filter-on {
			background-color: #ffcccc;
			color: #333333;
			text-decoration: line-through;
		}

		a.filter-off {
			background-color: #ccffcc;
			color: #333333;
		}
	`;

	const isOnForum = window.location.href.includes('forum');

	const site = {};
	if (isOnForum) {

	} else {
        //$( "li" ).removeClass( "odd" );

		site.css = 'li.filtered { display: none; } ' + commonCss;
		site.cssDebug = 'li.filtered { background-color: khaki; } ' + commonCss;
     	site.filterStatusLocation = '.files-table';
		site.itemsToCheck = '.files-table li a';
		site.itemType = 'obiecte';
		site.removeFilter = function(el) {
			el.parentNode.parentNode.classList.remove('filtered');
		};
		site.applyFilter = function(el, activeFilter) {
			if (el.innerText.match(activeFilter)) {
				el.parentNode.parentNode.classList.add('filtered');
				return true;
			}
			return false;
		};
	}

	insertStyle();
	insertStatus();
	filterScripts();
	insertSwitches();

	function insertStyle() {
		const style = document.createElement('style');
		style.textContent = DEBUGGING ? site.cssDebug : site.css;
		style.type = 'text/css';
		document.head.appendChild(style);
	}

	function insertStatus() {
		const p = document.querySelector(site.filterStatusLocation);
		if (p) {
			const status = document.createElement('span');
			status.className = 'filter-status';
			p.appendChild(status);
		}
	}

	function filterScripts() {
		const activeFilters = [];
		for (let filterType of Object.keys(filters)) {
			if (configGetValue(filterType, 'on') === 'on') {
				activeFilters.push(filters[filterType]);
			}
		}
		const nodes = document.querySelectorAll(site.itemsToCheck);
		let numFiltered = 0;
		for (let node of nodes) {
			site.removeFilter(node);
			for (let activeFilter of activeFilters) {
				let filtered = site.applyFilter(node, activeFilter);
				if (filtered) {
					numFiltered++;
					break;
				}
			}
		}
		const filterStatus = document.querySelector('.filter-status');
		if (filterStatus) {
			const numUnfiltered = document.querySelectorAll(site.itemsToCheck).length - numFiltered;
			filterStatus.textContent = `${numUnfiltered} ${site.itemType} (${numFiltered} filtrate)`;
		}
	}

	function insertSwitches() {
		const span = document.createElement('span');
		span.className = 'filter-switches';
		for (let filterType of Object.keys(filters)) {
			span.appendChild(createSwitch(filterType, configGetValue(filterType, 'on') === 'on'));
		}
		const filterStatus = document.querySelector('.filter-status');
		if (filterStatus) {
			filterStatus.parentNode.appendChild(span);
		}
	}

	function createSwitch(label, isOn) {
		const a = document.createElement('a');
		a.className = isOn ? 'filter-on' : 'filter-off';
		a.textContent = label;
		a.addEventListener('click', function(e) {
			if (this.className === 'filter-on') {
				this.className = 'filter-off';
				configSetValue(this.textContent, 'off');
			} else {
				this.className = 'filter-on';
				configSetValue(this.textContent, 'on');
			}
			filterScripts();
			e.preventDefault();
		}, false);
		return a;
	}

	function configSetValue(name, value) {
		localStorage.setItem(name, value);
	}

	function configGetValue(name, defaultValue) {
		const value = localStorage.getItem(name);
		return value ? value : defaultValue;
	}

})();
