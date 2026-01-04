// ==UserScript==
// @name     SpecialCust
// @version  0.199
// @grant    none
// @namespace http://tampermonkey.net/
// @license MIT
// @match https://www.login.germandrawings.com*
// @description Array of cost. whith datas which are used got itteration
// @downloadURL https://update.greasyfork.org/scripts/461066/SpecialCust.user.js
// @updateURL https://update.greasyfork.org/scripts/461066/SpecialCust.meta.js
// ==/UserScript==


var specialCostumers ={
     
    20120:{
        manual: "https://germandrawings.notion.site/20120-9a506d77e2534c9ab4c15299fed62e7d",
        message: "HMI стил може да нарача. Прочитај повеќе детали во упатство"
    }, 
    20121:{
        manual: "https://germandrawings.notion.site/20121-bf3f558ae9ca45108333180d42b59077",
        message: "SIE Stil може да нарача. Мебелот и ѕидовите треба да имаат сенка"
    },
    20172:{
        manual: "https://germandrawings.notion.site/20172-c1535680e451441483b6dd7abcf0204e",
        message: "Секогаш пред бројот за метри квадратни треба да се додаде \"ca.\" "
    }, 
    20533:{
        manual: "https://germandrawings.notion.site/20533-76d3a1b3806e4046af89ff4eca270042",
        message: "Има сопствен стил GIS може да користи и наши стилови"
    }, 
    20570:{
        manual: "https://germandrawings.notion.site/20570-d7aaafde66ae471b8cf1f3777e9f35cc",
        message: "Не цртаме градини и екстериер. Секогаш во портрет формат со димензии 1000х795 (види инфо)",
        lageplan:{
            manual:"https://germandrawings.notion.site/20570-f82eed34670045378aca9bd3c898414e",
            message:"Лагеплан плановите треба да испорачаме во портрет со димензија 1170х790 пиксели"
        }
    }, 
    20599:{
        manual: "https://germandrawings.notion.site/20599-b7b5e3a83dc24c7281c7915695f575fd",
        message: "Цртежите се испорачуваат во Landscape секогаш. Долга страна на цртежот од лево кон десно"
    }, 
    20705:{
        manual: "https://germandrawings.notion.site/20705-1d13e7f994b24ee8b13e3214f0df6a4e",
        message: "Ако е во стандард стил, цртаме светло зелени цвеќиња на цел план - надвор и внатре."
    }, 
    20853:{
        manual: "https://germandrawings.notion.site/20853-55febf1f72144888b1e7942341cfe91f",
        message: "Не се ротираат плановите, како што се закачени така ги цртаме (види инфо)"
    }, 
    20895:{
        manual: "https://germandrawings.notion.site/20895-c568077abd384d82b6796df326732e85",
        message: "Ако планот е во HER стилот секогаш користиме паркет од истиот стил. (види инфо) ЦРТЕЖОТ НЕ ТРЕБА ДА ИМА Watermark"
    }, 
   
    21007:{
        manual: "https://germandrawings.notion.site/21007-4d5032619c5545a6bfcdb22276f51b81",
        message: "Планот секогаш се поставува во лендскејп формат и се експортира во 1350x900 резолуција"
    }, 
 
    21181:{
        manual: "https://germandrawings.notion.site/21181-f9c98b8afb3b4625a49a5729c741b102",
        message: "Доколку на оргиналниот план нема нацртано прозори, планот го цртаме без прозори"
    }, 
    21247:{
        manual:"https://germandrawings.notion.site/21247-84fe93614e644c94bb26eef3849cd17d",
        message:"Ако клиентот одбрал стил КЅК, стилот е поделен на два подстила, разликата е само во плочките во бања. KSK-I Parkettboden – schwarz – со антрацит плочки. KSK-I Parkettboden – beige – со беж плочки. Можно е да нарача и во друг стил, пр. MC2.."
    }, 
    21330:{
        manual: "https://germandrawings.notion.site/21330-436bae13fa144af18a357a15ceab13af",
        message: "Сите бројки за метри квадратни се пишуваат со една децимална бројка: ТОЧНО: 24,3m2"
    }, 
  
    21669:{
        manual: "https://germandrawings.notion.site/21669-1d295b4f94e445f2abc5f59ba71f85e5",
        message: "Мебелот не се лепи за ѕид, освен во бања и кујна"
    }, 
    22189:{
        manual: "https://germandrawings.notion.site/22189-f9f9280c656548d49fd82e1b477a7b0e",
        message: "Испорачуваме во landscape и катно ниво стално долу средина со сите големи БУКВИ"
    }, 
    22297:{
        manual: "https://germandrawings.notion.site/22297-5854287a07a8489ab5d43e44e532ecde",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот."
    }, 
    22427:{
        manual: "https://germandrawings.notion.site/22427-74518f9f39514b8c94a3be5063e320f7",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот."
    }, 
    22468:{
        manual: "https://germandrawings.notion.site/22468-42bde0ade6504b14a418c2648e7bab6a",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот."
    }, 
    22470:{
        manual: "https://germandrawings.notion.site/22470-ae705f298e1c4d2db264f321d5783691",
        message: "ПРОЧИТАЈ ИНФО!!!"
    }, 
    22480:{
        manual: "https://germandrawings.notion.site/22480-5ab2e0d54cf54fb9a08a3279023665d8",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот"
    }, 
    23117:{
        manual: "https://germandrawings.notion.site/23117-3d42bfabdb30427296f1818df876f498",
        message: "Се пишуваат сите коти, ако е потребно и во повеќе редови. Санитариите се идентични 1:1 како на оплан."
    }, 
    23473:{
        manual: "https://germandrawings.notion.site/23473-9cb24f3f96bb4c83b0e30af5345e58f9",
        message: "Санитарни елементи цртаме како на оплан ако се нацртани, ако не се ги цртаме по наши правила. На план без мебел нема плочки и санитарни елементи празна соба целосно на топол под. Кујна и дневна во иста соба - нема плочки во кујна. "
    }, 
    23494:{
        manual: "https://germandrawings.notion.site/23494-14adc7853f7a4ff3a3cffdf6b4ffe78a",
        message: "Плановите се експортираат во размер 1:100"
    }, 
    23942:{
        manual: "https://germandrawings.notion.site/23942-4941193593964157ad78c945b22f35bd",
        message: "Санитарни елементи цртаме како на оплан ако се нацртани, ако не се ги цртаме по наши правила. На план без мебел нема плочки и санитарни елементи празна соба целосно на топол под. Кујна и дневна во иста соба - нема плочки во кујна. "
    }, 
    23963:{
        manual: "https://germandrawings.notion.site/23963-b6f051c32f2d4ffd80b1b09e517f69b4",
        message: "Цртежите се испорачуваат во Landscape секогаш"
    }, 
    24027:{
        manual: "https://germandrawings.notion.site/24027-1039ce9c7784402e986d9d2c44f335c4",
        message: "Кај лагеплан го користиме грундрисот, а не кровот од куќата на објектот. "
    }, 
    24154:{
        manual: "https://germandrawings.notion.site/24154-aee2ab8427a44554be7202065fd1b4e0",
        message: "Санитарни елементи цртаме како на оплан ако се нацртани, ако не се ги цртаме по наши правила. На план без мебел нема плочки и санитарни елементи празна соба целосно на топол под. Кујна и дневна во иста соба - нема плочки во кујна. "
    }, 
    24183:{
        manual: "https://germandrawings.notion.site/24183-46641a16319d46d59314b713aef62594",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    24281:{
        manual: "https://germandrawings.notion.site/24281-364c17db45344fa4a56fc993e036d613",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот."
    }, 
    24389:{
        manual: "https://germandrawings.notion.site/24389-e9173c324bd346839526b16972597a09",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    24391:{
        manual: "https://germandrawings.notion.site/24391-2cb09dc318b143398824dc20b83306a9",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    24483:{
        manual: "https://germandrawings.notion.site/24483-3c35d066d938479db42907ffbbd6ab6c",
        message: "Десно долу под планот напиши Skizze ohne Gewähr. Не испорачуваме пакети во рамка. Види упатство за повеќе инфо!",
        lageplan: {
            manual:"https://germandrawings.notion.site/24483-188d9a30ef8942bca07c6078a80f084a",
            message: "На Lageplan-овите секогаш главната парцела да биде под прав агол во однос на листот, без разлика како е на основата или каде се наоѓа северот."
        }
    }, 
    24643:{
        manual: "https://germandrawings.notion.site/24643-994d48e17c7c406b955d46fa07b42d1d",
        message: "Плановите од пакет се во иста рамка според најголемот цртеж. Планот секогаш е на иста позиција од рамката не на средина на рамка!"
    }, 
    24806:{
        manual: "https://germandrawings.notion.site/24806-bb04c0d74a2b4153821439d88dcd8fe9",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    24940:{
        manual: "https://germandrawings.notion.site/24940-f5ad3571e9a74f6a85c9551e9317101c",
        message: "Мебелот не се лепи за ѕид, освен во бања и кујна."
    }, 
    24993:{
        manual: "https://germandrawings.notion.site/24993-26a4f86d7f5a4e5081f3d5622089bfad",
        message: "Дрвен под на тераса/балкон, зелени растенија ба балкон, број во круг пред влена врата, катно ниво секогаш долу десно."
    }, 
    25027:{
        manual: "https://germandrawings.notion.site/25027-44675f1aabd240838e9f9a5e8c8ef439",
        message: "Цртаме секогаш во NW3 во спална соба има специјален кревет со 4 зелени перници. Види упатство"
    }, 
    25184:{
        manual: "https://germandrawings.notion.site/25184-14020be2e48441f49ed29de91cf46d63",
        message: "Плановите се испорачуваат во портрет формат"
    },
    25323:{
        manual: "https://germandrawings.notion.site/25323-6781122e88794bc4824984927bdcd34d",
        message: "Ако кујната е отворена не ставаме плочки. Не сака никакви аксесоари на планот празни да бидат маси и комоди, без цвеќиња. Во детска соба несака шарено столче."
    }, 
    25332:{
        manual: "https://germandrawings.notion.site/25332-22a71a74521646e58ab4e6482bb9a681",
        message: "Испорака во портрет формат со посебна рамка - Види упатство!"
    }, 
    25391:{
        manual: "https://germandrawings.notion.site/25391-67d2cc56fd544efbbbcd7d201c6edd2a",
        message: "Плановите се испорачуваат во портрет формат"
    }, 
    25586:{
        manual: "https://germandrawings.notion.site/25586-50e75c78c1294f219231c1e619b53a06",
        message: "Во Акварел стиловите терасите и балконите се 10% црна боја (сиви). Во другите стилови користиме плочки од стилот."
    }, 
    25659:{
        manual: "https://germandrawings.notion.site/25659-1fb7acd3da824874b6c8a5a2363676b2",
        message: "Има посебни правила за уредување во WEI стил. Прочитај упатство."
    }, 
    25791:{
        manual: "https://germandrawings.notion.site/25791-93c68be62f9d4de585f4586d3bc6d32f",
        message: "Lageplan-овите да се нацртани целосни како на основата, односно да се нацртаат главниот објект и сите околни објекти што се прикажани на основата"
    }, 
    25803:{
        manual: "https://germandrawings.notion.site/25803-fa65da6a686b4bf4ab370e3334f18f8e",
        message: "Секогаш пишуваме катно ниво долу десно со иста големина на букви како имиња на соби. Градини не цртаме."
    }, 
    25963:{
        manual: "https://germandrawings.notion.site/25963-c9d0211d850943bc8ffaf03566f5b10a",
        message: "Плановите треба да имаатт маргини околу планот со големина од 3cm"
    }, 
    26098:{
        manual: "https://germandrawings.notion.site/26098-d1dbf2ff77aa467aa694023a21def303",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    26631:{
        manual: "https://germandrawings.notion.site/26631-bb115e61979d47ceb0e959530ce15b00",
        message: "Цртежите се испорачуваат во Landscape секогаш. Долга страна на цртежот од лево кон десно."
    }, 
    26745:{
        manual: "https://germandrawings.notion.site/26745-64a48fb5853f4584adbd9e54ecf1f6c3",
        message: "Лого горе десно, долу во средина секогаш да пишува unverbindliche Illustration"
    }, 
    27009:{
        manual: "https://germandrawings.notion.site/27009-1150cd520724427ba3fd42bcf9954d22",
        message: "Не ротираме план, цртааме мебел како на оргинал 1:1, не уредуваме остави, нема плочки во кујна и др… Види упатство!"
    }, 
    27011:{
        manual: "https://germandrawings.notion.site/27011-b1a61f52ce5749c5b501d7b637538558",
        message: "Цртежите се испорачуваат во Landscape секогаш. Долга страна на цртежот од лево кон десно."
    }, 
    27500:{
        manual: "https://germandrawings.notion.site/27500-cbdedd08a7784dfcb649e261bbe8d2a5",
        message: "Не ротираме план, цртааме мебел како на оргинал 1:1, не уредуваме остави, нема плочки во кујна и др… Види упатство!"
    },
    27504:{
        manual: "https://germandrawings.notion.site/27504-0ca008895a7e47bdb3a4933ea85e78b9",
        message: "Цртежите се испорачуваат во Landscape секогаш. Долга страна на цртежот од лево кон десно. Види го опланот, најчесто клиентот веќе го има завртено планот во лендскејп според формата на објектот. Крајниот цртеж треба да го прикаже самииот објект во лендскејп, а не да добие слика со бели површини за да биде лендскејп, а објектот да биде во портрет насока на сликата."
    }, 
    27550:{
        manual: "https://germandrawings.notion.site/27550-7819e11fde194f829310df85e647457a",
        message: "Не ротираме план, цртааме мебел како на оргинал 1:1, не уредуваме остави, нема плочки во кујна и др… Види упатство!"
    }, 
    27586:{
        manual: "https://germandrawings.notion.site/27586-abe206824943424882bf09ebd30a8bd4",
        message: "SRM Стил може да нарача овој клиент - Прочитај упатство!"
    }, 
    27592:{
        manual: "https://germandrawings.notion.site/27592-1c867f30894d41efa130b472c502cf6a",
        message: "Цртежите се испорачуваат во Landscape 2000x1333 пиксели. Уреди исто како оплан. Поден туш секогаш. Балконски врати секогаш отворени дури ако сметаат на мебел. ЗА QM → Плановите по емаил кај клиентот се испорачуваат"
    }, 
    27872:{
        manual: "https://germandrawings.notion.site/27872-4f4d45194420484baeb3883b24dff13e",
        message: "Landscape формат 1600х1200 може да има дополнителна бела рамка околу планот."
    }, 
    27998:{
        manual: "https://germandrawings.notion.site/27998-c1b6672e5a274f84b7829d3d658cc8e6",
        message: "Пред квадратурата секогаш се пишува са. и квадратурите секогаш се со една децимала"
    }, 
    28086:{
        manual: "https://germandrawings.notion.site/28086-10848d675c9f4674846c5cedf2c79bf9",
        message: "Уредуваме идентично 1:1 како на оплан без никакви отстапки."
    }, 
    28233:{
        manual: "https://germandrawings.notion.site/28233-d2170e450ec346519dc35bf0a1ce16e4",
        message: "Ако нарачал во стил ANI - Прочитај упатство"
    }, 
    28374:{
        manual: "https://germandrawings.notion.site/28374-233290d6544248d1974138291a278997",
        message: "Плановите се испорачуваат во портрет формат"
    }, 
    28633:{
        manual: "https://germandrawings.notion.site/28663-81c59c4126d14295bf06524a52d0ecf6",
        message: "Кај пакет нарачките, доколку најголемиот план одстапува многу во габарит во однос на другите планови од пакет, тогаш на најголемиот план не ставаме рамка за пропорција. Останатите, помали планови, се ставаат во рамка за пропорција."
    }, 
    28823:{
        manual: "https://germandrawings.notion.site/28823-a42b786f6d0648df9c8a1ae47a06d2fe",
        message: "Планот се ротира така што имињата да се читаат од оплан од лево кон десно. Испорачуваме во портрет формат. Ако оплан е лендскепј го оставаме и додаваме бела рамка за портрет."
    }, 
    29269:{
        manual: "https://germandrawings.notion.site/29269-4c98a910b9cf4f8faed2f824fb6e7a35",
        message: "Квадратурите на собите секогаш се пишуваат со цел број, без запирка и децимални места. Пред бројот се става ca."
    }, 
    29463:{
        manual: "",
        message: "Сите нарачки/куланци од клиентот 29463 што содржат во описот “KL00…” (Стил МС2) треба да: 1. Имаат ист дрвен под – паркет во сите соби и КУЈНА, 2. Во бањата се цртаат плочките од балкон, 3. На балкон/тераса се цртаат плочките во кујна но во СИВА боја."
    },
    29683:{
        manual: "https://germandrawings.notion.site/29683-74894b92caa34179ad85bc9b63f1c202",
        message: "Имињата на собите треба да му се напишат исто како што е на оргиналниот план дури и ако се на друг јазик (француски)"
    }, 
    29855:{
        manual: "https://germandrawings.notion.site/29855-c48c711ff894462d889e966024cd1001",
        message: "Посебни барања со прозори, цвеќиња и имиња на соби. Види упатство!"
    }, 
    30096:{
        manual: "https://germandrawings.notion.site/30920-0090c652918646fb94e060ceb55d6ccc",
        message: "Ако на оплан имињата се на Француски, ги пишуваме на Француски"
    },
    30157:{
        manual: "https://germandrawings.notion.site/30175-91fa5c48cb604618aaf36a34e911cb1a",
        message: "Посебни побарувања во JEN стил. Прочитај упатство!"
    }, 
    30920:{
        manual: "https://germandrawings.notion.site/30920-0090c652918646fb94e060ceb55d6ccc",
        message: "Ако на оплан имињата се на Француски, ги пишуваме на Француски"
    }, 
    30926:{
        manual: "https://germandrawings.notion.site/30926-3a3cf75cf440400ab11064195f625dcd",
        message: "Посебни побарувања во JEN стил. Прочитај упатство!"
    }, 
    30927:{
        manual: "https://germandrawings.notion.site/30927-88653a250ff941448b2ac31b6e4d0cc5",
        message: "Посебни побарувања во JEN стил. Прочитај упатство!"
    }, 
    30928:{
        manual: "https://germandrawings.notion.site/30928-ccc3306e7de34feb88c4834eb2e89a70",
        message: "Посебни побарувања во JEN стил. Прочитај упатство!"
    }, 
    31546:{
        manual: "https://germandrawings.notion.site/31546-1cda4eab0e1c4ad8b11029ea7d72510b",
        message: "Цртежите се експортираат во голема резолуција. Портрет 2970х4200. Лендскејп 4200х2970"
    }, 
    31802:{
        manual: "https://germandrawings.notion.site/31802-78102952a8564ad1996ffb1d959ebb28",
        message: "Два идентични планови има во нарачката - едниот план со коти друтиот без коти. Внимавај на рачен коментар. Уредуваме како на оргинал."
    }, 
    32453:{
        manual: "https://germandrawings.notion.site/32453-4f6094a3f07d493eb841e1dd08d791ba",
        message: "Плановите се испорачуваат во портрет формат"
    }, 
    32893:{
        manual: "https://germandrawings.notion.site/32893-e0ac58abe44948848cffa7ed0a9e9558",
        message: "PRO Стил - Проичитај упатство"
    }, 
    33098:{
        manual: "https://germandrawings.notion.site/33098-24ac5f20695344388fc3f1c948bd9e0d",
        message: "Во сите соби освен санитарни и кујна се става паркет од CS. Банкираи под на тераса. Не се котираат ѕидови. Коти во метри со големина на фонт 18.2"
    }, 
    33554:{
        manual: "https://germandrawings.notion.site/33554-75e0a95472614101870bcf6f9a47964f",
        message: "Стрелката за север секогаш ја поставуваме на истата локација (место) каде што е нацртана на оргиналниот план без разлика како е означено во систем."
    },
    35229:{
        manual:"https://germandrawings.notion.site/21247-84fe93614e644c94bb26eef3849cd17d",
        message:"Ако клиентот одбрал стил КЅК, стилот е поделен на два подстила, разликата е само во плочките во бања. KSK-I Parkettboden – schwarz – со антрацит плочки. KSK-I Parkettboden – beige – со беж плочки. Можно е да нарача и во друг стил, пр. MC2.."
    },
    35419:{
        manual: "https://germandrawings.notion.site/35419-4ad7776f6e1d40a889201b1fbea85721?pvs=4",
        message: "На сите планови треба да ја користиме тревата од Standard стилот кај грундрис и Lageplan Leicht стилот кај лагеплан - светла зелена"
    },
    35670:{
        manual: "https://germandrawings.notion.site/35670-c1535680e451441483b6dd7abcf0204e",
        message: "Секогаш пред бројот за метри квадратни треба да се додаде \"ca.\" "
    },
    36275:{
        manual: "https://germandrawings.notion.site/36275-db13f27a7a8743ed8d7ef06ff8ee501b?pvs=4",
        message: "Плановите се уредуваат 1:1 како оригиналниот план"
    },
}