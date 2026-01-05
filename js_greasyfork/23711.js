// ==UserScript==
// @name        contaraves
// @namespace   -
// @description Conta quantas espécies de aves da lista do usuário tiveram seu registro em determinado local
// @include     http://www.wikiaves.com/especies.php?t=u&u=*
// @include     http://www.wikiaves.com.br/especies.php?t=u&u=*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23711/contaraves.user.js
// @updateURL https://update.greasyfork.org/scripts/23711/contaraves.meta.js
// ==/UserScript==

var extrato,seletor,seletorb,seletorc,quiqui,queque,tt,pen,tem,extcid,cc,dd,temest;
var barrawidth=0;
var pe = "&p=";
var emno = " em ";
var estados = [
  "/AC<","/AL<","/AM<","/AP<","/BA<","/CE<","/DF<","/ES<","/GO<","/MA<","/MG<","/MS<","/MT<","/PA<","/PB<","/PE<","/PI<","/PR<","/RJ<","/RN<","/RO<","/RR<","/SC<","/SE<",
	"/SP<","/TO<","-<br>"];

var listacodIBGE = [
"Aceguá","4300034","Água Santa","4300059","Agudo","4300109","Ajuricaba","4300208","Alecrim","4300307","Alegrete","4300406","Alegria","4300455",
"Almirante Tamandaré do Sul","4300471","Alpestre","4300505","Alto Alegre","4300554","Alto Feliz","4300570","Alvorada","4300604","Amaral Ferrador","4300638","Ametista do Sul","4300646",
"André da Rocha","4300661","Anta Gorda","4300703","Antônio Prado","4300802","Arambaré","4300851","Araricá","4300877","Aratiba","4300901","Arroio do Meio","4301008",
"Arroio do Padre","4301057","Arroio do Sal","4301073","Arroio do Tigre","4301107","Arroio dos Ratos","4301206","Arroio Grande","4301305","Arvorezinha","4301404",
"Augusto Pestana","4301503","Áurea","4301552","Bagé","4301602","Balneário Pinhal","4301636","Barão","4301651","Barão de Cotegipe","4301701","Barão do Triunfo","4301750",
"Barra do Quaraí","4301875","Barra do Guarita","4301859","Barra do Ribeiro","4301909","Barra do Rio Azul","4301925","Barra Funda","4301958","Barracão","4301800",
"Barros Cassal","4302006","Benjamin Constant do Sul","4302055","Bento Gonçalves","4302105","Boa Vista das Missões","4302154","Boa Vista do Buricá","4302204",
"Boa Vista do Cadeado","4302220","Boa Vista do Incra","4302238","Boa Vista do Sul","4302253","Bom Jesus","4302303","Bom Princípio","4302352","Bom Progresso","4302378",
"Bom Retiro do Sul","4302402","Boqueirão do Leão","4302451","Bossoroca","4302501","Bozano","4302584","Braga","4302600","Brochier","4302659","Butiá","4302709",
"Caçapava do Sul","4302808","Cacequi","4302907","Cachoeira do Sul","4303004","Cachoeirinha","4303103","Cacique Doble","4303202","Caibaté","4303301","Caiçara","4303400",
"Camaquã","4303509","Camargo","4303558","Cambará do Sul","4303608","Campestre da Serra","4303673","Campina das Missões","4303707","Campinas do Sul","4303806","Campo Bom","4303905",
"Campo Novo","4304002","Campos Borges","4304101","Candelária","4304200","Cândido Godói","4304309","Candiota","4304358","Canela","4304408","Canguçu","4304507",
"Canoas","4304606","Canudos do Vale","4304614","Capão Bonito do Sul","4304622","Capão da Canoa","4304630","Capão do Cipó","4304655","Capão do Leão","4304663",
"Capela de Santana","4304671","Capitão","4304689","Capivari do Sul","4304697","Carazinho","4304705","Caraá","4304713","Carlos Barbosa","4304804","Carlos Gomes","4304853",
"Casca","4304903","Caseiros","4304952","Catuípe","4305009","Caxias do Sul","4305108","Centenário","4305116","Cerrito","4305124","Cerro Branco","4305132",
"Cerro Grande","4305157","Cerro Grande do Sul","4305173","Cerro Largo","4305207","Chapada","4305306","Charqueadas","4305355","Charrua","4305371","Chiapetta","4305405",
"Chuí","4305439","Chuvisca","4305447","Cidreira","4305454","Ciríaco","4305504","Colinas","4305587","Colorado","4305603","Condor","4305702","Constantina","4305801",
"Coqueiro Baixo","4305835","Coqueiros do Sul","4305850","Coronel Barros","4305871","Coronel Bicaco","4305900","Coronel Pilar","4305934","Cotiporã","4305959",
"Coxilha","4305975","Crissiumal","4306007","Cristal","4306056","Cristal do Sul","4306072","Cruz Alta","4306106","Cruzaltense","4306130","Cruzeiro do Sul","4306205",
"David Canabarro","4306304","Derrubadas","4306320","Dezesseis de Novembro","4306353","Dilermando de Aguiar","4306379","Dois Irmãos","4306403","Dois Irmãos das Missões","4306429",
"Dois Lajeados","4306452","Dom Feliciano","4306502","Dom Pedrito","4306551","Dom Pedro de Alcântara","4306601","Dona Francisca","4306700","Doutor Maurício Cardoso","4306734",
"Doutor Ricardo","4306759","Eldorado do Sul","4306767","Encantado","4306809","Encruzilhada do Sul","4306908","Engenho Velho","4306924","Entre-Ijuís","4306932",
"Entre Rios do Sul","4306957","Erebango","4306973","Erechim","4307005","Ernestina","4307054","Erval Grande","4307203","Erval Seco","4307302","Esmeralda","4307401",
"Esperança do Sul","4307450","Espumoso","4307500","Estação","4307559","Estância Velha","4307609","Esteio","4307708","Estrela","4307807","Estrela Velha","4307815","Eugênio de Castro","4307831",
"Fagundes Varela","4307864","Farroupilha","4307906","Faxinal do Soturno","4308003","Faxinalzinho","4308052","Fazenda Vilanova","4308078","Feliz","4308102","Flores da Cunha","4308201",
"Floriano Peixoto","4308250","Fontoura Xavier","4308300","Formigueiro","4308409","Forquetinha","4308433","Fortaleza dos Valos","4308458","Frederico Westphalen","4308508",
"Garibaldi","4308607","Garruchos","4308656","Gaurama","4308706","General Câmara","4308805","Gentil","4308854","Getúlio Vargas","4308904","Giruá","4309001",
"Glorinha","4309050","Gramado","4309100","Gramado dos Loureiros","4309126","Gramado Xavier","4309159","Gravataí","4309209","Guabiju","4309258","Guaíba","4309308",
"Guaporé","4309407","Guarani das Missões","4309506","Harmonia","4309555","Herval","4307104","Herveiras","4309571","Horizontina","4309605","Hulha Negra","4309654",
"Humaitá","4309704","Ibarama","4309753","Ibiaçá","4309803","Ibiraiaras","4309902","Ibirapuitã","4309951","Ibirubá","4310009","Igrejinha","4310108","Ijuí","4310207",
"Ilópolis","4310306","Imbé","4310330","Imigrante","4310363","Independência","4310405","Inhacorá","4310413","Ipê","4310439","Ipiranga do Sul","4310462","Iraí","4310504",
"Itaara","4310538","Itacurubi","4310553","Itapuca","4310579","Itaqui","4310603","Itati","4310652","Itatiba do Sul","4310702","Ivorá","4310751","Ivoti","4310801",
"Jaboticaba","4310850","Jacuizinho","4310876","Jacutinga","4310900","Jaguarão","4311007","Jaguari","4311106","Jaquirana","4311122","Jari","4311130","Jóia","4311155",
"Júlio de Castilhos","4311205","Lagoa Bonita do Sul","4311239","Lagoa dos Três Cantos","4311254","Lagoa Vermelha","4311270","Lagoão","4311304","Lajeado","4311403",
"Lajeado do Bugre","4311429","Lavras do Sul","4311502","Liberato Salzano","4311601","Lindolfo Collor","4311627","Linha Nova","4311643","Maçambara","4311700",
"Machadinho","4311718","Mampituba","4311734","Manoel Viana","4311759","Maquiné","4311775","Maratá","4311791","Marau","4311809","Marcelino Ramos","4311908",
"Mariana Pimentel","4311981","Mariano Moro","4312005","Marques de Souza","4312054","Mata","4312104","Mato Castelhano","4312138","Mato Leitão","4312153","Mato Queimado","4312179",
"Maximiliano de Almeida","4312203","Minas do Leão","4312252","Miraguaí","4312302","Montauri","4312351","Monte Alegre dos Campos","4312377","Monte Belo do Sul","4312385",
"Montenegro","4312401","Mormaço","4312427","Morrinhos do Sul","4312443","Morro Redondo","4312450","Morro Reuter","4312476","Mostardas","4312500","Muçum","4312609",
"Muitos Capões","4312617","Muliterno","4312625","Não-Me-Toque","4312658","Nicolau Vergueiro","4312674","Nonoai","4312708","Nova Alvorada","4312757","Nova Araçá","4312807",
"Nova Bassano","4312906","Nova Boa Vista","4312955","Nova Bréscia","4313003","Nova Candelária","4313011","Nova Esperança do Sul","4313037","Nova Hartz","4313060",
"Nova Pádua","4313086","Nova Palma","4313102","Nova Petrópolis","4313201","Nova Prata","4313300","Nova Ramada","4313334","Nova Roma do Sul","4313359","Nova Santa Rita","4313375",
"Novo Barreiro","4313391","Novo Cabrais","4313409","Novo Hamburgo","4313425","Novo Machado","4313441","Novo Tiradentes","4313466","Novo Xingu","4313490",
"Osório","4313508","Paim Filho","4313607","Palmares do Sul","4313656","Palmeira das Missões","4313706","Palmitinho","4313805","Panambi","4313904","Pantano Grande","4313953",
"Paraí","4314001","Paraíso do Sul","4314027","Pareci Novo","4314035","Parobé","4314050","Passa Sete","4314068","Passo do Sobrado","4314076","Passo Fundo","4314100",
"Paulo Bento","4314134","Paverama","4314159","Pedras Altas","4314175","Pedro Osório","4314209","Pejuçara","4314308","Pelotas","4314407","Picada Café","4314423",
"Pinhal","4314456","Pinhal da Serra","4314464","Pinhal Grande","4314472","Pinheirinho do Vale","4314498","Pinheiro Machado","4314506","Pirapó","4314555",
"Piratini","4314605","Planalto","4314704","Poço das Antas","4314753","Pontão","4314779","Ponte Preta","4314787","Portão","4314803","Porto Alegre","4314902",
"Porto Lucena","4315008","Porto Mauá","4315057","Porto Vera Cruz","4315073","Porto Xavier","4315107","Pouso Novo","4315131","Presidente Lucena","4315149",
"Progresso","4315156","Protásio Alves","4315172","Putinga","4315206","Quaraí","4315305","Quatro Irmãos","4315313","Quevedos","4315321","Quinze de Novembro","4315354",
"Redentora","4315404","Relvado","4315453","Restinga Seca","4315503","Rio dos Índios","4315552","Rio Grande","4315602","Rio Pardo","4315701","Riozinho","4315750",
"Roca Sales","4315800","Rodeio Bonito","4315909","Rolador","4315958","Rolante","4316006","Ronda Alta","4316105","Rondinha","4316204","Roque Gonzales","4316303",
"Rosário do Sul","4316402","Sagrada Família","4316428","Saldanha Marinho","4316436","Salto do Jacuí","4316451","Salvador das Missões","4316477","Salvador do Sul","4316501",
"Sananduva","4316600","Sant\'\Ana do Livramento","4316709","Santa Bárbara do Sul","4316733","Santa Cecília do Sul","4316758","Santa Clara do Sul","4316808",
"Santa Cruz do Sul","4316907","Santa Margarida do Sul","4316956","Santa Maria","4316972","Santa Maria do Herval","4317004","Santa Rosa","4317103",
"Santa Tereza","4317202","Santa Vitória do Palmar","4317251","Santana da Boa Vista","4317301","Santiago","4317400","Santo Ângelo","4317509",
"Santo Antônio da Patrulha","4317558","Santo Antônio das Missões","4317608","Santo Antônio do Palma","4317707","Santo Antônio do Planalto","4317756",
"Santo Augusto","4317806","Santo Cristo","4317905","Santo Expedito do Sul","4317954","São Borja","4318002","São Domingos do Sul","4318051",
"São Francisco de Assis","4318101","São Francisco de Paula","4318200","São Gabriel","4318309","São Jerônimo","4318408","São João da Urtiga","4318424",
"São João do Polêsine","4318432","São Jorge","4318440","São José das Missões","4318457","São José do Herval","4318465","São José do Hortêncio","4318481",
"São José do Inhacorá","4318499","São José do Norte","4318507","São José do Ouro","4318606","São José do Sul","4318614","São José dos Ausentes","4318622",
"São Leopoldo","4318705","São Lourenço do Sul","4318804","São Luiz Gonzaga","4318903","São Marcos","4319000","São Martinho","4319109",
"São Martinho da Serra","4319125","São Miguel das Missões","4319158","São Nicolau","4319208","São Paulo das Missões","4319307","São Pedro da Serra","4319356",
"São Pedro das Missões","4319364","São Pedro do Butiá","4319372","São Pedro do Sul","4319406","São Sebastião do Caí","4319505","São Sepé","4319604",
"São Valentim","4319703","São Valentim do Sul","4319711","São Valério do Sul","4319737","São Vendelino","4319752","São Vicente do Sul","4319802",
"Sapiranga","4319901","Sapucaia do Sul","4320008","Sarandi","4320107","Seberi","4320206","Sede Nova","4320230","Segredo","4320263","Selbach","4320305",
"Senador Salgado Filho","4320321","Sentinela do Sul","4320354","Serafina Corrêa","4320404","Sério","4320453","Sertão","4320503","Sertão Santana","4320552",
"Sete de Setembro","4320578","Severiano de Almeida","4320602","Silveira Martins","4320651","Sinimbu","4320677","Sobradinho","4320701","Soledade","4320800","Tabaí","4320859",
"Tapejara","4320909","Tapera","4321006","Tapes","4321105","Taquara","4321204","Taquari","4321303","Taquaruçu do Sul","4321329","Tavares","4321352",
"Tenente Portela","4321402","Terra de Areia","4321436","Teutônia","4321451","Tio Hugo","4321469","Tiradentes do Sul","4321477","Toropi","4321493","Torres","4321501",
"Tramandaí","4321600","Travesseiro","4321626","Três Arroios","4321634","Três Cachoeiras","4321667","Três Coroas","4321709","Três de Maio","4321808","Três Forquilhas","4321832",
"Três Palmeiras","4321857","Três Passos","4321907","Trindade do Sul","4321956","Triunfo","4322004","Tucunduva","4322103","Tunas","4322152",
"Tupanci do Sul","4322186","Tupanciretã","4322202","Tupandi","4322251","Tuparendi","4322301","Turuçu","4322327","Ubiretama","4322343","União da Serra","4322350",
"Unistalda","4322376","Uruguaiana","4322400","Vacaria","4322509","Vale do Sol","4322525","Vale Real","4322533","Vale Verde","4322541","Vanini","4322558","Venâncio Aires","4322608",
"Vera Cruz","4322707","Veranópolis","4322806","Vespasiano Correa","4322855","Viadutos","4322905","Viamão","4323002","Vicente Dutra","4323101","Victor Graeff","4323200",
"Vila Flores","4323309","Vila Lângaro","4323358","Vila Maria","4323408","Vila Nova do Sul","4323457","Vista Alegre","4323507","Vista Alegre do Prata","4323606","Vista Gaúcha","4323705",
"Vitória das Missões","4323754","Westfalia","4323770","Xangri-lá","4323804"];

if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}

function comeca() {
  var lugar = '.ttPage';
  $(lugar).append($('\
	<form action = >\
	<fieldset>\
	<select id = "selLocal">\
	<option>Todas</option>\
	<option>no Estado</option>\
	<option>fora do Estado</option>\
	<option>Aceguá</option>\
	<option>Água Santa</option>\
	<option>Agudo</option>\
	<option>Ajuricaba</option>\
	<option>Alecrim</option>\
	<option>Alegrete</option>\
	<option>Alegria</option>\
	<option>Almirante Tamandaré do Sul</option>\
	<option>Alpestre</option>\
	<option>Alto Alegre</option>\
	<option>Alto Feliz</option>\
	<option>Alvorada</option>\
	<option>Amaral Ferrador</option>\
	<option>Ametista do Sul</option>\
	<option>André da Rocha</option>\
	<option>Anta Gorda</option>\
	<option>Antônio Prado</option>\
	<option>Arambaré</option>\
	<option>Araricá</option>\
	<option>Aratiba</option>\
	<option>Arroio do Meio</option>\
	<option>Arroio do Padre</option>\
	<option>Arroio do Sal</option>\
	<option>Arroio do Tigre</option>\
	<option>Arroio dos Ratos</option>\
	<option>Arroio Grande</option>\
	<option>Arvorezinha</option>\
	<option>Augusto Pestana</option>\
	<option>Áurea</option>\
	<option>Bagé</option>\
	<option>Balneário Pinhal</option>\
	<option>Barão</option>\
	<option>Barão de Cotegipe</option>\
	<option>Barão do Triunfo</option>\
	<option>Barra do Quaraí</option>\
	<option>Barra do Guarita</option>\
	<option>Barra do Ribeiro</option>\
	<option>Barra do Rio Azul</option>\
	<option>Barra Funda</option>\
	<option>Barracão</option>\
	<option>Barros Cassal</option>\
	<option>Benjamin Constant do Sul</option>\
	<option>Bento Gonçalves</option>\
	<option>Boa Vista das Missões</option>\
	<option>Boa Vista do Buricá</option>\
	<option>Boa Vista do Cadeado</option>\
	<option>Boa Vista do Incra</option>\
	<option>Boa Vista do Sul</option>\
	<option>Bom Jesus</option>\
	<option>Bom Princípio</option>\
	<option>Bom Progresso</option>\
	<option>Bom Retiro do Sul</option>\
	<option>Boqueirão do Leão</option>\
	<option>Bossoroca</option>\
	<option>Bozano</option>\
	<option>Braga</option>\
	<option>Brochier</option>\
	<option>Butiá</option>\
	<option>Caçapava do Sul</option>\
	<option>Cacequi</option>\
	<option>Cachoeira do Sul</option>\
	<option>Cachoeirinha</option>\
	<option>Cacique Doble</option>\
	<option>Caibaté</option>\
	<option>Caiçara</option>\
	<option>Camaquã</option>\
	<option>Camargo</option>\
	<option>Cambará do Sul</option>\
	<option>Campestre da Serra</option>\
	<option>Campina das Missões</option>\
	<option>Campinas do Sul</option>\
	<option>Campo Bom</option>\
	<option>Campo Novo</option>\
	<option>Campos Borges</option>\
	<option>Candelária</option>\
	<option>Cândido Godói</option>\
	<option>Candiota</option>\
	<option>Canela</option>\
	<option>Canguçu</option>\
	<option>Canoas</option>\
	<option>Canudos do Vale</option>\
	<option>Capão Bonito do Sul</option>\
	<option>Capão da Canoa</option>\
	<option>Capão do Cipó</option>\
	<option>Capão do Leão</option>\
	<option>Capela de Santana</option>\
	<option>Capitão</option>\
	<option>Capivari do Sul</option>\
	<option>Carazinho</option>\
	<option>Caraá</option>\
	<option>Carlos Barbosa</option>\
	<option>Carlos Gomes</option>\
	<option>Casca</option>\
	<option>Caseiros</option>\
	<option>Catuípe</option>\
	<option>Caxias do Sul</option>\
	<option>Centenário</option>\
	<option>Cerrito</option>\
	<option>Cerro Branco</option>\
	<option>Cerro Grande</option>\
	<option>Cerro Grande do Sul</option>\
	<option>Cerro Largo</option>\
	<option>Chapada</option>\
	<option>Charqueadas</option>\
	<option>Charrua</option>\
	<option>Chiapetta</option>\
	<option>Chuí</option>\
	<option>Chuvisca</option>\
	<option>Cidreira</option>\
	<option>Ciríaco</option>\
	<option>Colinas</option>\
	<option>Colorado</option>\
	<option>Condor</option>\
	<option>Constantina</option>\
	<option>Coqueiro Baixo</option>\
	<option>Coqueiros do Sul</option>\
	<option>Coronel Barros</option>\
	<option>Coronel Bicaco</option>\
	<option>Coronel Pilar</option>\
	<option>Cotiporã</option>\
	<option>Coxilha</option>\
	<option>Crissiumal</option>\
	<option>Cristal</option>\
	<option>Cristal do Sul</option>\
	<option>Cruz Alta</option>\
	<option>Cruzaltense</option>\
	<option>Cruzeiro do Sul</option>\
	<option>David Canabarro</option>\
	<option>Derrubadas</option>\
	<option>Dezesseis de Novembro</option>\
	<option>Dilermando de Aguiar</option>\
	<option>Dois Irmãos</option>\
	<option>Dois Irmãos das Missões</option>\
	<option>Dois Lajeados</option>\
	<option>Dom Feliciano</option>\
	<option>Dom Pedrito</option>\
	<option>Dom Pedro de Alcântara</option>\
	<option>Dona Francisca</option>\
	<option>Doutor Maurício Cardoso</option>\
	<option>Doutor Ricardo</option>\
	<option>Eldorado do Sul</option>\
	<option>Encantado</option>\
	<option>Encruzilhada do Sul</option>\
	<option>Engenho Velho</option>\
	<option>Entre-Ijuís</option>\
	<option>Entre Rios do Sul</option>\
	<option>Erebango</option>\
	<option>Erechim</option>\
	<option>Ernestina</option>\
	<option>Erval Grande</option>\
	<option>Erval Seco</option>\
	<option>Esmeralda</option>\
	<option>Esperança do Sul</option>\
	<option>Espumoso</option>\
	<option>Estação</option>\
	<option>Estância Velha</option>\
	<option>Esteio</option>\
	<option>Estrela</option>\
	<option>Estrela Velha</option>\
	<option>Eugênio de Castro</option>\
	<option>Fagundes Varela</option>\
	<option>Farroupilha</option>\
	<option>Faxinal do Soturno</option>\
	<option>Faxinalzinho</option>\
	<option>Fazenda Vilanova</option>\
	<option>Feliz</option>\
	<option>Flores da Cunha</option>\
	<option>Floriano Peixoto</option>\
	<option>Fontoura Xavier</option>\
	<option>Formigueiro</option>\
	<option>Forquetinha</option>\
	<option>Fortaleza dos Valos</option>\
	<option>Frederico Westphalen</option>\
	<option>Garibaldi</option>\
	<option>Garruchos</option>\
	<option>Gaurama</option>\
	<option>General Câmara</option>\
	<option>Gentil</option>\
	<option>Getúlio Vargas</option>\
	<option>Giruá</option>\
	<option>Glorinha</option>\
	<option>Gramado</option>\
	<option>Gramado dos Loureiros</option>\
	<option>Gramado Xavier</option>\
	<option>Gravataí</option>\
	<option>Guabiju</option>\
	<option>Guaíba</option>\
	<option>Guaporé</option>\
	<option>Guarani das Missões</option>\
	<option>Harmonia</option>\
	<option>Herval</option>\
	<option>Herveiras</option>\
	<option>Horizontina</option>\
	<option>Hulha Negra</option>\
	<option>Humaitá</option>\
	<option>Ibarama</option>\
	<option>Ibiaçá</option>\
	<option>Ibiraiaras</option>\
	<option>Ibirapuitã</option>\
	<option>Ibirubá</option>\
	<option>Igrejinha</option>\
	<option>Ijuí</option>\
	<option>Ilópolis</option>\
	<option>Imbé</option>\
	<option>Imigrante</option>\
	<option>Independência</option>\
	<option>Inhacorá</option>\
	<option>Ipê</option>\
	<option>Ipiranga do Sul</option>\
	<option>Iraí</option>\
	<option>Itaara</option>\
	<option>Itacurubi</option>\
	<option>Itapuca</option>\
	<option>Itaqui</option>\
	<option>Itati</option>\
	<option>Itatiba do Sul</option>\
	<option>Ivorá</option>\
	<option>Ivoti</option>\
	<option>Jaboticaba</option>\
	<option>Jacuizinho</option>\
	<option>Jacutinga</option>\
	<option>Jaguarão</option>\
	<option>Jaguari</option>\
	<option>Jaquirana</option>\
	<option>Jari</option>\
	<option>Jóia</option>\
	<option>Júlio de Castilhos</option>\
	<option>Lagoa Bonita do Sul</option>\
	<option>Lagoa dos Três Cantos</option>\
	<option>Lagoa Vermelha</option>\
	<option>Lagoão</option>\
	<option>Lajeado</option>\
	<option>Lajeado do Bugre</option>\
	<option>Lavras do Sul</option>\
	<option>Liberato Salzano</option>\
	<option>Lindolfo Collor</option>\
	<option>Linha Nova</option>\
	<option>Maçambara</option>\
	<option>Machadinho</option>\
	<option>Mampituba</option>\
	<option>Manoel Viana</option>\
	<option>Maquiné</option>\
	<option>Maratá</option>\
	<option>Marau</option>\
	<option>Marcelino Ramos</option>\
	<option>Mariana Pimentel</option>\
	<option>Mariano Moro</option>\
	<option>Marques de Souza</option>\
	<option>Mata</option>\
	<option>Mato Castelhano</option>\
	<option>Mato Leitão</option>\
	<option>Mato Queimado</option>\
	<option>Maximiliano de Almeida</option>\
	<option>Minas do Leão</option>\
	<option>Miraguaí</option>\
	<option>Montauri</option>\
	<option>Monte Alegre dos Campos</option>\
	<option>Monte Belo do Sul</option>\
	<option>Montenegro</option>\
	<option>Mormaço</option>\
	<option>Morrinhos do Sul</option>\
	<option>Morro Redondo</option>\
	<option>Morro Reuter</option>\
	<option>Mostardas</option>\
	<option>Muçum</option>\
	<option>Muitos Capões</option>\
	<option>Muliterno</option>\
	<option>Não-Me-Toque</option>\
	<option>Nicolau Vergueiro</option>\
	<option>Nonoai</option>\
	<option>Nova Alvorada</option>\
	<option>Nova Araçá</option>\
	<option>Nova Bassano</option>\
	<option>Nova Boa Vista</option>\
	<option>Nova Bréscia</option>\
	<option>Nova Candelária</option>\
	<option>Nova Esperança do Sul</option>\
	<option>Nova Hartz</option>\
	<option>Nova Pádua</option>\
	<option>Nova Palma</option>\
	<option>Nova Petrópolis</option>\
	<option>Nova Prata</option>\
	<option>Nova Ramada</option>\
	<option>Nova Roma do Sul</option>\
	<option>Nova Santa Rita</option>\
	<option>Novo Barreiro</option>\
	<option>Novo Cabrais</option>\
	<option>Novo Hamburgo</option>\
	<option>Novo Machado</option>\
	<option>Novo Tiradentes</option>\
	<option>Novo Xingu</option>\
	<option>Osório</option>\
	<option>Paim Filho</option>\
	<option>Palmares do Sul</option>\
	<option>Palmeira das Missões</option>\
	<option>Palmitinho</option>\
	<option>Panambi</option>\
	<option>Pantano Grande</option>\
	<option>Paraí</option>\
	<option>Paraíso do Sul</option>\
	<option>Pareci Novo</option>\
	<option>Parobé</option>\
	<option>Passa Sete</option>\
	<option>Passo do Sobrado</option>\
	<option>Passo Fundo</option>\
	<option>Paulo Bento</option>\
	<option>Paverama</option>\
	<option>Pedras Altas</option>\
	<option>Pedro Osório</option>\
	<option>Pejuçara</option>\
	<option>Pelotas</option>\
	<option>Picada Café</option>\
	<option>Pinhal</option>\
	<option>Pinhal da Serra</option>\
	<option>Pinhal Grande</option>\
	<option>Pinheirinho do Vale</option>\
	<option>Pinheiro Machado</option>\
	<option>Pirapó</option>\
	<option>Piratini</option>\
	<option>Planalto</option>\
	<option>Poço das Antas</option>\
	<option>Pontão</option>\
	<option>Ponte Preta</option>\
	<option>Portão</option>\
	<option>Porto Alegre</option>\
	<option>Porto Lucena</option>\
	<option>Porto Mauá</option>\
	<option>Porto Vera Cruz</option>\
	<option>Porto Xavier</option>\
	<option>Pouso Novo</option>\
	<option>Presidente Lucena</option>\
	<option>Progresso</option>\
	<option>Protásio Alves</option>\
	<option>Putinga</option>\
	<option>Quaraí</option>\
	<option>Quatro Irmãos</option>\
	<option>Quevedos</option>\
	<option>Quinze de Novembro</option>\
	<option>Redentora</option>\
	<option>Relvado</option>\
	<option>Restinga Seca</option>\
	<option>Rio dos Índios</option>\
	<option>Rio Grande</option>\
	<option>Rio Pardo</option>\
	<option>Riozinho</option>\
	<option>Roca Sales</option>\
	<option>Rodeio Bonito</option>\
	<option>Rolador</option>\
	<option>Rolante</option>\
	<option>Ronda Alta</option>\
	<option>Rondinha</option>\
	<option>Roque Gonzales</option>\
	<option>Rosário do Sul</option>\
	<option>Sagrada Família</option>\
	<option>Saldanha Marinho</option>\
	<option>Salto do Jacuí</option>\
	<option>Salvador das Missões</option>\
	<option>Salvador do Sul</option>\
	<option>Sananduva</option>\
	<option>Sant\'\Ana do Livramento</option>\
	<option>Santa Bárbara do Sul</option>\
	<option>Santa Cecília do Sul</option>\
	<option>Santa Clara do Sul</option>\
	<option>Santa Cruz do Sul</option>\
	<option>Santa Margarida do Sul</option>\
	<option>Santa Maria</option>\
	<option>Santa Maria do Herval</option>\
	<option>Santa Rosa</option>\
	<option>Santa Tereza</option>\
	<option>Santa Vitória do Palmar</option>\
	<option>Santana da Boa Vista</option>\
	<option>Santiago</option>\
	<option>Santo Ângelo</option>\
	<option>Santo Antônio da Patrulha</option>\
	<option>Santo Antônio das Missões</option>\
	<option>Santo Antônio do Palma</option>\
	<option>Santo Antônio do Planalto</option>\
	<option>Santo Augusto</option>\
	<option>Santo Cristo</option>\
	<option>Santo Expedito do Sul</option>\
	<option>São Borja</option>\
	<option>São Domingos do Sul</option>\
	<option>São Francisco de Assis</option>\
	<option>São Francisco de Paula</option>\
	<option>São Gabriel</option>\
	<option>São Jerônimo</option>\
	<option>São João da Urtiga</option>\
	<option>São João do Polêsine</option>\
	<option>São Jorge</option>\
	<option>São José das Missões</option>\
	<option>São José do Herval</option>\
	<option>São José do Hortêncio</option>\
	<option>São José do Inhacorá</option>\
	<option>São José do Norte</option>\
	<option>São José do Ouro</option>\
	<option>São José do Sul</option>\
	<option>São José dos Ausentes</option>\
	<option>São Leopoldo</option>\
	<option>São Lourenço do Sul</option>\
	<option>São Luiz Gonzaga</option>\
	<option>São Marcos</option>\
	<option>São Martinho</option>\
	<option>São Martinho da Serra</option>\
	<option>São Miguel das Missões</option>\
	<option>São Nicolau</option>\
	<option>São Paulo das Missões</option>\
	<option>São Pedro da Serra</option>\
	<option>São Pedro das Missões</option>\
	<option>São Pedro do Butiá</option>\
	<option>São Pedro do Sul</option>\
	<option>São Sebastião do Caí</option>\
	<option>São Sepé</option>\
	<option>São Valentim</option>\
	<option>São Valentim do Sul</option>\
	<option>São Valério do Sul</option>\
	<option>São Vendelino</option>\
	<option>São Vicente do Sul</option>\
	<option>Sapiranga</option>\
	<option>Sapucaia do Sul</option>\
	<option>Sarandi</option>\
	<option>Seberi</option>\
	<option>Sede Nova</option>\
	<option>Segredo</option>\
	<option>Selbach</option>\
	<option>Senador Salgado Filho</option>\
	<option>Sentinela do Sul</option>\
	<option>Serafina Corrêa</option>\
	<option>Sério</option>\
	<option>Sertão</option>\
	<option>Sertão Santana</option>\
	<option>Sete de Setembro</option>\
	<option>Severiano de Almeida</option>\
	<option>Silveira Martins</option>\
	<option>Sinimbu</option>\
	<option>Sobradinho</option>\
	<option>Soledade</option>\
	<option>Tabaí</option>\
	<option>Tapejara</option>\
	<option>Tapera</option>\
	<option>Tapes</option>\
	<option>Taquara</option>\
	<option>Taquari</option>\
	<option>Taquaruçu do Sul</option>\
	<option>Tavares</option>\
	<option>Tenente Portela</option>\
	<option>Terra de Areia</option>\
	<option>Teutônia</option>\
	<option>Tio Hugo</option>\
	<option>Tiradentes do Sul</option>\
	<option>Toropi</option>\
	<option>Torres</option>\
	<option>Tramandaí</option>\
	<option>Travesseiro</option>\
	<option>Três Arroios</option>\
	<option>Três Cachoeiras</option>\
	<option>Três Coroas</option>\
	<option>Três de Maio</option>\
	<option>Três Forquilhas</option>\
	<option>Três Palmeiras</option>\
	<option>Três Passos</option>\
	<option>Trindade do Sul</option>\
	<option>Triunfo</option>\
	<option>Tucunduva</option>\
	<option>Tunas</option>\
	<option>Tupanci do Sul</option>\
	<option>Tupanciretã</option>\
	<option>Tupandi</option>\
	<option>Tuparendi</option>\
	<option>Turuçu</option>\
	<option>Ubiretama</option>\
	<option>União da Serra</option>\
	<option>Unistalda</option>\
	<option>Uruguaiana</option>\
	<option>Vacaria</option>\
	<option>Vale do Sol</option>\
	<option>Vale Real</option>\
	<option>Vale Verde</option>\
	<option>Vanini</option>\
	<option>Venâncio Aires</option>\
	<option>Vera Cruz</option>\
	<option>Veranópolis</option>\
	<option>Vespasiano Correa</option>\
	<option>Viadutos</option>\
	<option>Viamão</option>\
	<option>Vicente Dutra</option>\
	<option>Victor Graeff</option>\
	<option>Vila Flores</option>\
	<option>Vila Lângaro</option>\
	<option>Vila Maria</option>\
	<option>Vila Nova do Sul</option>\
	<option>Vista Alegre</option>\
	<option>Vista Alegre do Prata</option>\
	<option>Vista Gaúcha</option>\
	<option>Vitória das Missões</option>\
	<option>Westfalia</option>\
	<option>Xangri-lá</option>\
 </select>\
  <input type = "button"\
    value = "filtrar"\
    id = "botaum"\
  </fieldset>\
 </form>\
'));
  $("#botaum").click (analisa);
}

function analisa() {
	//TODO: mudar pagina antes da analize para &o=3
	var lugarbarra = '.ttPage > form:nth-child(1) > fieldset:nth-child(1)';
	$(lugarbarra).append($('\
		<style>\
	#myProgress {\
  position: relative;\
  width: 100%;\
  height: 30px;\
  background-color: #ddd;\
	}\
	#myBar {\
  position: absolute;\
  width: 0%;\
  height: 100%;\
  background-color: #4CAF50;\
	}\
	#label {\
  text-align: center;\
  line-height: 30px;\
  color: white;\
	}\
	</style>\
		<div id="myProgress">\
  <div id="myBar">\
    <div id="label">0%</div>\
  </div>\
	</div>\
	'));		
		
		
  var tabela = document.getElementsByClassName('especies') [0];
  var local = document.getElementById("selLocal");
  var localb = local.options[local.selectedIndex].text;
	document.getElementById("selLocal").disabled = true;
	document.getElementById("botaum").disabled = true;
	$(".textpadding > div:nth-child(6) > b:nth-child(1) > a:nth-child(1)").text("");
	$(".textpadding > div:nth-child(6) > b:nth-child(2) > a:nth-child(1)").text("");
	$(".textpadding > div:nth-child(6) > b:nth-child(3) > a:nth-child(1)").text("");
	$(".titulo > td:nth-child(1) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(2) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(3) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(4) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(5) > a:nth-child(1)").removeAttr("href");
	
	if (localb==="no Estado"){
		emno=" ";
    extcid = conecta("especies.php?&t=e&e=20");
	}

	else if (localb==="Todas"){
		location.reload();
    }
	else if (localb==="fora do Estado"){
		emno=" ";
		extcid = conecta("especies.php?t=t");
    
	}
	else{
		extcid = conecta("especies.php?&t=c&c="+converte(localb));
	}
 
  for (var i = 2, row; i<=tabela.rows.length; i++) {
    row = tabela.rows[i];
		pen = Math.ceil(parseFloat($("tr.especie:nth-child("+i+") > td:nth-child(5) > a:nth-child(1)").text())/10);
		seletorc =  'tr.especie:nth-child(' + i + ') > td:nth-child(3) > a:nth-child(1)';
		quuquu = $(seletorc).text();
		
		if (!extcid.contains(quuquu)){
			var cuia = 'tr.especie:nth-child(' + i + ')';
			$(cuia).hide();
		}
		
		else{
		
    seletor = 'tr.especie:nth-child(' + i + ') > td:nth-child(5) > a:nth-child(1)';
    seletorb = 'tr.especie:nth-child(' + i + ') > td:nth-child(4) > a:nth-child(1)';
    quiqui = $(seletor).attr('href'); //registros foto
    queque = $(seletorb).attr('href'); //registros sons
		
    
	if (quiqui === undefined) { //SOH SOM
    	
     cc = conecta(queque);
     if (localb==="fora do Estado"){
			 for (var g=0;g<estados.length;g++){
				 if (cc.contains(estados[g])){temest=true;dd=null;
					 break;
				 }
				
				}
     } 
     else{dd = converte(localb);}      
      if (cc.contains(dd) == true||temest==true) {temest=false;} 
      else {
        var cuia = 'tr.especie:nth-child(' + i + ')';
        $(cuia).hide();
      }
    }
			
			
    else { // imagem E som ou soh imagem
	
			if (queque===undefined){ //n tem som
				for (var k=1;k<=pen;k++){
					cc=(conecta(quiqui+pe+k));
				 	if (localb==="fora do Estado"){
					 for (var g=0;g<estados.length;g++){
				 			if (cc.contains(estados[g])){temest=true;dd=null;
						 break;
								 }
						}
     			} 
     			else{dd = converte(localb);} 
						if (cc.contains(dd) == true||temest==true) {tem=true;break;
						}}
		 				if (tem==true) {tem=false;temest=false;}
		 				else{
          		var cuia = 'tr.especie:nth-child(' + i + ')';
          		$(cuia).hide();
							}
					}
	 
     else{ //som e foto, ver som antes
			 cc=(conecta(queque)); //conecta com som
			 
			 if (localb==="fora do Estado"){ 
			 	for (var g=0;g<estados.length;g++){
				 if (cc.contains(estados[g])){temest=true;dd=null;
					 break;}}} 
     	 else{dd = converte(localb);} 
			
			 if (cc.contains(dd) == true||temest==true) {temest=false;} 
		  
			 else{ //som não tem, bora ver foto
				 
				 for (var k=1;k<=pen;k++){
					cc=(conecta(quiqui+pe+k));
					 console.log("aqui "+quiqui);
				 		if (localb==="fora do Estado"){
			 				for (var g=0;g<estados.length;g++){
				 				if (cc.contains(estados[g])){temest=true;dd=null;
					 			break;}}} 
     				else{dd = converte(localb);} 
				
					 if (cc.contains(dd) == true||temest==true) {tem=true;break;
						}}
		 			if (tem==true) {tem=false;temest=false;}
		 			else{
          	var cuia = 'tr.especie:nth-child(' + i + ')';
          	$(cuia).hide();
				
			}			
			}
		}
    }
		}
		
		////AQYU
		var elem = document.getElementById("myBar");
		barrawidth+= (100/(tabela.rows.length));
		elem.style.width = barrawidth + '%';
		document.getElementById("label").innerHTML = (barrawidth.toFixed(2)) * 1  + '%';  
	}
  
  
	$(".total > b:nth-child(2)").text(contar(tabela));
	$(".total").append(emno + localb);
	$(".total").get(0).scrollIntoView();
	elem.style.width = "100%";
	document.getElementById("label").innerHTML = "100%";
	console.log(converte(localb));
}
	
function contar(atabela) {
	tt = 0;
	for (var i = 1, row; i<=atabela.rows.length; i++) {
		row = atabela.rows[i];
		var cuia = 'tr.especie:nth-child(' + i + ')';
		if ($(cuia).is(':visible')){
			tt++; //$(cuia).css("background-color","red");
			}
			}
	return (tt);
			}
				
function conecta(x){
	var xhr;
	xhr = new XMLHttpRequest();
	xhr.open('GET', x, false);
	xhr.send();
	extrato = xhr.response;
	return (extrato);
	  
}

function converte(cidade){ //cidade
  if (cidade ==="no Estado"){
    valorcidade = "/RS<";
  }
  else{
	var valorcidade = listacodIBGE[(listacodIBGE.indexOf(cidade)+1)];
  }
	return valorcidade;
}

waitForKeyElements('.ttPage', comeca);
