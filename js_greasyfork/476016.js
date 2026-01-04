// ==UserScript==
// @name         FichasOP++
// @version      1.0
// @description  Adiciona todos os rituais, poderes, habilidades e itens do livro de regras ao site FichasOP.
// @author       OCORVO007
// @match        https://www.fichasop.com/sessao/personagem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fichasop.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1180107
// @downloadURL https://update.greasyfork.org/scripts/476016/FichasOP%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/476016/FichasOP%2B%2B.meta.js
// ==/UserScript==

const classe = document.getElementsByClassName("p-2 my-3 border border-secondary")[2].innerHTML;
const trilha = document.getElementsByClassName("p-2 my-3 border border-secondary")[3].innerHTML;

//  region rituais
let rituais = [
    {
        name: "Desconhecido",
        circle: "",
        element: "",
        execution: "",
        range: "",
        target: "",
        duration: "",
        description: ""
    },{
        name: "Alterar Destino",
        circle: "4",
        element: "Energia",
        execution: "rea\xE7\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "instant\xE2nea",
        description: "Voc\xEA vislumbra seu futuro pr\xF3ximo, analisando milh\xF5es de possibilidades e escolhendo a melhor. Voc\xEA recebe +15 em um teste de resist\xEAncia ou na Defesa contra um ataque.\n\nVerdadeiro (+5 PE): muda o alcance para \u201Ccurto\u201D e o alvo para \u201Cum aliado \xE0 sua escolha\u201D."
    }, {
        name: "Alterar Mem\xF3ria",
        circle: "3",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "instant\xE2nea",
        save: "Vontade anula",
        normalDice: "1d4",
        description: "Voc\xEA invade a mente do alvo e altera ou apaga suas mem\xF3rias de at\xE9 uma hora atr\xE1s. Se escolher alterar as mem\xF3rias, voc\xEA pode mudar detalhes de eventos recentes, como a identidade de algu\xE9m encontrado ou o endere\xE7o de um lugar visitado, mas n\xE3o reescrever completamente esses eventos. O alvo recupera suas mem\xF3rias ap\xF3s 1d4 dias.\n\nVerdadeiro (+4 PE): voc\xEA pode alterar ou apagar mem\xF3rias de at\xE9 24 horas atr\xE1s. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Amaldi\xE7oar Arma",
        circle: "1",
        element: "Varia",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 arma corpo a corpo ou pacote de muni\xE7\xE3o",
        duration: "cena",
        description: "Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Voc\xEA imbui a arma ou muni\xE7\xF5es com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.\n\nDiscente (+2 PE): muda o b\xF4nus de dano para +2d6. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o b\xF4nus de dano para +4d6. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Amaldi\xE7oar Tecnologia",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 acess\xF3rio ou arma de fogo",
        duration: "cena",
        description: "Voc\xEA imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modifica\xE7\xE3o a sua escolha.\n\nDiscente (+2 PE): muda para duas modifica\xE7\xF5es. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda para tr\xEAs modifica\xE7\xF5es. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "\xC2ncora Temporal",
        circle: "3",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "cena",
        save: "Vontade parcial",
        description: "Uma aura espiralada surge sobre o alvo. No in\xEDcio de cada turno dele, ele deve fazer um teste de Vontade. Se falhar, n\xE3o poder\xE1 se deslocar naquele turno (ele ainda pode agir, s\xF3 n\xE3o pode se deslocar). Se o alvo passar nesse teste dois turnos seguidos o efeito termina.\n\nVerdadeiro (+4 PE): muda o alvo para \u201Cseres \xE0 sua escolha\u201D. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Aprimorar F\xEDsico",
        circle: "2",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "cena",
        description: "O alvo tem seus m\xFAsculos tonificados e seus ligamentos refor\xE7ados, recebendo +1 em Agilidade ou For\xE7a, \xE0 escolha dele.\n\nDiscente (+3 PE): muda o b\xF4nus para +2. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): muda o b\xF4nus para +3. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Aprimorar Mente",
        circle: "2",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "cena",
        description: "O alvo tem sua mente energizada por fagulhos do Conhecimento. Ele recebe +1 em Intelecto ou Presen\xE7a, \xE0 escolha dele (esse aumento n\xE3o fornece PE ou per\xEDcias treinadas).\n\nDiscente (+3 PE): muda o b\xF4nus para +2. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): muda o b\xF4nus para +3. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Arma Atroz",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 arma corpo a corpo",
        duration: "sustentada",
        description: "A arma \xE9 recoberta por veias carmesim e passa a exalar uma aura de viol\xEAncia. Ela fornece +2 em testes de ataque e +1 na margem de amea\xE7a.\n\nDiscente (+2 PE): muda o b\xF4nus para +5 em testes de ataque. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o b\xF4nus para +5 em testes de ataque e +2 na margem de amea\xE7a e no multiplicador de cr\xEDtico. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Armadura de Sangue",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapa\xE7a que fornece +5 em Defesa. Esse b\xF4nus \xE9 cumulativo com outros rituais, mas n\xE3o com b\xF4nus fornecido por equipamento.\n\nDiscente (+5 PE): muda o efeito para \u201Cfornece +10 na Defesa e resist\xEAncia a bal\xEDstico, corte, impacto e perfura\xE7\xE3o 5\u201D. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+9 PE): muda o efeito para \u201Cfornece +15 na Defesa e resist\xEAncia a bal\xEDstico, corte, impacto e perfura\xE7\xE3o 10\u201D. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Barganha Insana",
        circle: "3",
        element: "Morte",
        execution: "completa",
        range: "pessoal",
        target: "voc\xEA",
        duration: "instant\xE2nea",
        description: "Voc\xEA contata a entidade da Morte e entrega a ela parte de sua pr\xF3pria percep\xE7\xE3o temporal da Realidade, em troca da restaura\xE7\xE3o plena de sua sa\xFAde. Voc\xEA recupera todos os pontos de vida e pontos de energia, e elimina quaisquer condi\xE7\xF5es negativas que o estejam afetando. Por\xE9m, no final da cena, perde 1d4 pontos de Sanidade permanentemente. Al\xE9m disso, cada vez que conjura este ritual, sua pele adquire uma tonalidade mais acizentada e seu sangue fica mais escuro. Alguns ocultistas temem que m\xFAltiplos usos tenham como efeito colateral transforma-lo em um luz\xEDdio, embora ningu\xE9m saiba exatamente quantas conjura\xE7\xF5es seriam necess\xE1rias para completar essa transforma\xE7\xE3o."
    }, {
        name: "Canalizar o Medo",
        circle: "4",
        element: "Medo",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "permanente at\xE9 ser descarregada",
        description: "Voc\xEA transfere parte de seu poder para outra pessoa. Escolha um ritual de at\xE9 3\xBA c\xEDrculo que voc\xEA conhe\xE7a; o alvo pode conjurar este ritual em sua forma b\xE1sica uma vez, sem pagar seu custo em PE (mas pode usar formas avan\xE7adas gastando seus pr\xF3prios PE para isso). At\xE9 o ritual transferido ser conjurado, seus PE m\xE1ximos diminuem em um valor igual ao custo dele."
    }, {
        name: "Capturar o Cora\xE7\xE3o",
        circle: "4",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 pessoa",
        duration: "cena",
        save: "Vontade parcial",
        description: "Voc\xEA desperta uma paix\xE3o doentia e obcecada por voc\xEA no alvo, que passa a querar agrad\xE1-lo a todo custo, mesmo que para isso precise ficar contra seus amigos. No in\xEDcio de cada turno do alvo ele deve fazer um teste de Vontade. Se falhar, age de forma a ajud\xE1-lo na melhor de suas capacidades naquele turno. Se o alvo passar nesse teste dois turnos seguidos o efeito termina."
    }, {
        name: "Chamas do Caos",
        circle: "2",
        element: "Energia",
        execution: "padr\xE3o",
        range: "curto",
        target: "veja texto",
        duration: "cena",
        normalDice: "1d6",
        discenteDice: "4d6",
        verdadeiroDice: "8d6",
        description: "Voc\xEA manipula o calor e o fogo. Ao conjurar o ritual, escolha um dos seguintes efeitos.Chamejar: o alvo \xE9 uma arma corpo a corpo. Ela causa +1d6 pontos de dano de fogo.Esquentar: o alvo \xE9 um objeto, que come\xE7a a esquentar. Ele sofre 1d6 pontos de dano de fogo por rodada e causa o mesmo dano a qualquer ser que o esteja empunhando ou vestindo. A crit\xE9rio do mestre, o objeto ou o ser pode pegar fogo. Um ser pode gastar uma a\xE7\xE3o completa para resfriar o objeto (jogando areia ou se jogando numa fonte de \xE1gua pr\xF3xima, por exemplo) e cancelar o efeito do ritual.Extinguir: o alvo \xE9 uma chama de tamanho Grande ou menor, que \xE9 apagada. Isso cria uma nuvem de fuma\xE7a que ocupa uma esfera de 3m de raio centrada onde estava a chama. Dentro da fuma\xE7a, seres t\xEAm camuflagem.Modelar: o alvo \xE9 uma chama de tamanho Grande ou menor. A cada rodada, voc\xEA pode gastar uma a\xE7\xE3o livre para moviment\xE1-la 9m em qualquer dire\xE7\xE3o. Se atravessar o espa\xE7o ocupado por um ser, ela causa 3d6 pontos de dano de fogo nele. Um ser s\xF3 pode sofrer dano dessa maneira uma vez por rodada.\n\nDiscente (+3 PE): muda a dura\xE7\xE3o para sustentada e adiciona \u201CResist\xEAncia: Reflexos reduz \xE0 metade\u201D. Em vez do normal, uma vez por rodada voc\xEA pode gastar uma a\xE7\xE3o de movimento para projetar uma labareda, num alvo em alcance curto. O alvo sofre 4d6 pontos de dano de Energia (Reflexos reduz \xE0 metade).\n\nVerdadeiro (+ 7 PE): como discente, mas muda o dano para 8d6. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Cicatriza\xE7\xE3o",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        normalDice: "3d8+3",
        discenteDice: "5d8+5",
        verdadeiroDice: "7d8+7",
        description: "Voc\xEA acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente.\n\nDiscente (+2 PE): aumenta a cura para 5d8+5 PV. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+9 PE): muda o alcance para \u201Ccurto\u201D, o alvo para \u201Cseres escolhidos\u201D e aumenta a cura para 7d8+7 PV. Requer 4\xBA c\xEDrculo e afinidade com Morte."
    }, {
        name: "Ciner\xE1ria",
        circle: "1",
        element: "Medo",
        execution: "padr\xE3o",
        range: "curto",
        area: "nuvem de 6m de raio",
        duration: "cena",
        description: "Voc\xEA manifesta uma n\xE9voa carregada de ess\xEAncia paranormal. Rituais conjurados dentro da n\xE9voa t\xEAm sua DT aumentada em +5.\n\nDiscente (+2 PE): al\xE9m do normal, rituais conjurados dentro da n\xE9voa custam \u20132 PE.\n\nVerdadeiro (+5 PE): al\xE9m do normal, rituais conjurados dentro da n\xE9voa causam dano maximizado."
    }, {
        name: "Coincid\xEAncia For\xE7ada",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "cena",
        description: "Voc\xEA manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de per\xEDcias.\n\nDiscente (+2 PE): muda o alvo para aliados \xE0 sua escolha. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o alvo para aliados \xE0 sua escolha e o b\xF4nus para +5. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Compreens\xE3o Paranormal",
        circle: "1",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser ou objeto",
        duration: "cena",
        save: "Vontade anula",
        description: "O ritual confere a voc\xEA compreens\xE3o sobrenatural da linguagem. Se tocar um objeto contendo informa\xE7\xE3o (ou livro, um dispositivo com uma grava\xE7\xE3o...), voc\xEA entende as palavras mesmo que n\xE3o conhe\xE7a seu idioma, contanto que se trate de um idioma humano (n\xE3o funciona com s\xEDmbolos ou sigilos paranormais). Se tocar uma pessoa, pode se comunicar com ela como se falassem um idioma em comum. Se tocar um ser n\xE3o inteligente, como um animal, pode perceber seus sentimentos b\xE1sicos, como medo ou felicidade. Um alvo involunt\xE1rio tem direito a um teste de Vontade.\n\nDiscente (+2 PE): muda o alcance para \u201Ccurto\u201D e o alvo para \u201Calvos escolhidos\u201D. Voc\xEA pode entender todos os alvos afetados. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o alcance para \u201Cpessoal\u201D e o alvo para \u201Cvoc\xEA\u201D. Em vez do normal, voc\xEA pode falar, entender e escrever qualquer idioma humano. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Conhecendo o Medo",
        circle: "4",
        element: "Medo",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "cena",
        save: "Vontade parcial",
        normalDice: "10d6",
        description: "Voc\xEA manifesta medo absoluto na mente do alvo. Se ele falhar no teste de resist\xEAncia, a Sanidade dele \xE9 reduzida a 0 e ele fica enlouquecendo. Se ele passar, sofre 10d6 pontos de dano mental e fica apavorado por 1 rodada. Uma pessoa que fique insana pelo efeito deste ritual se transforma em uma criatura Paranormal \xE0 crit\xE9rio do mestre."
    }, {
        name: "Conten\xE7\xE3o Fantasmag\xF3rica",
        circle: "2",
        element: "Energia",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        target: "1 ser",
        duration: "cena",
        save: "Reflexos anula",
        description: "Tr\xEAs la\xE7os de Energia surgem do ch\xE3o e se enroscam no alvo, deixando-o agarrado. O alvo pode tentar se livrar, gastando uma a\xE7\xE3o padr\xE3o para fazer um teste de Atletismo (DT do ritual). Se passar, destr\xF3i um la\xE7o, mais um la\xE7o adicional para cada 5 pontos pelos quais superou a DT. Os la\xE7os tamb\xE9m podem ser atacados e destru\xEDdos: cada um tem Defesa 10, 10 PV, RD 5 e imunidade a Energia. Se todos os la\xE7os forem destru\xEDdos, o ritual \xE9 dissipado. Por serem feitos de Energia, os la\xE7os afetam criaturas incorp\xF3reas.\n\nDiscente (+3 PE): aumenta o n\xFAmero de la\xE7os para 6, e voc\xEA pode escolher o alvo de cada la\xE7o, com um m\xEDnimo de dois la\xE7os por alvo. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): como discente, e cada la\xE7o destru\xEDdo libera uma onda de choque que causa 2d6+2 pontos de dano de Energia no alvo agarrado. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Consumir Manancial",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "instant\xE2nea",
        normalDice: "3d6",
        discenteDice: "6d6",
        verdadeiroDice: "3d6",
        description: "Voc\xEA suga uma pequena por\xE7\xE3o do tempo de vida de plantas, insetos e at\xE9 mesmo do solo ao redor, gerando lodo e recebendo 3d6 pontos de vida tempor\xE1rios. Os PV tempor\xE1rios desaparecem ao final da cena.\n\nDiscente (+2 PE): muda os PV tempor\xE1rios recebidos para 6d6. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o alvo para \u201C\xE1rea: esfera com 6m de raio centrada em voc\xEA\u201D e a resist\xEAncia para \u201CFortitude reduz \xE0 metade\u201D. Em vez do normal, voc\xEA suga energia de todos os seres vivos na \xE1rea, causando 3d6 pontos de dano de Morte em cada um e recebendo PV tempor\xE1rios iguais ao dano total causado at\xE9 o final da cena. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Contato Paranormal",
        circle: "3",
        element: "Conhecimento",
        execution: "completa",
        range: "pessoal",
        target: "voc\xEA",
        duration: "1 dia",
        description: "Voc\xEA barganha com a entidade de Conhecimento para que o auxilie durante o dia, em troca de se alimentar de sua Sanidade. Quando o ritual \xE9 conjurado, voc\xEA recebe seis d6. Sempre que fizer um teste de per\xEDcia, voc\xEA pode gastar um desses d6, rol\xE1-lo e adicionar o resultado no teste. No entanto, essa ajuda tem um pre\xE7o: sempre que rolar um 6 no dado, a entidade toma 2 pontos de Sanidade de voc\xEA. Se voc\xEA ficar sem dados ou chegar a Sanidade 0, o ritual acaba.\n\nDiscente (+4 PE): muda os dados de aux\xEDlio para d8. Sempre que rolar um 8 num desses dados, a entidade toma 3 pontos de sua Sanidade. Requer 4\xBA c\xEDrculo.\n\nVerdadeiro (+9 PE): muda os dados de aux\xEDlio para d12. Sempre que rolar um 12 num desses dados, a entidade toma 5 pontos de sua Sanidade. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Controle Mental",
        circle: "4",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        target: "1 pessoa ou animal",
        duration: "sustentada",
        save: "Vontade parcial",
        description: "Voc\xEA domina a mente do alvo, que obedece todos os seus comandos, exceto ordens suicidas. Um alvo tem direito a um teste de Vontade no final de cada um de seus turnos para se livrar do efeito. Alvos que passarem no teste ficam pasmos por 1 rodada.\n\nDiscente (+5 PE): muda o alvo para at\xE9 cinco pessoas ou animais.\n\nVerdadeiro (+10 PE): muda o alvo para at\xE9 dez pessoas ou animais. Requer afinidade com Conhecimento."
    }, {
        name: "Convoca\xE7\xE3o Instant\xE2nea",
        circle: "3",
        element: "Energia",
        execution: "padr\xE3o",
        range: "ilimitado",
        target: "1 objeto de at\xE9 2 espa\xE7os",
        duration: "instant\xE2nea",
        save: "Vontade anula",
        description: "Voc\xEA invoca um objeto de qualquer lugar para sua m\xE3o. O item deve ter sido previamente preparado com o s\xEDmbolo do ritual e pode ocupar no m\xE1ximo 2 espa\xE7os. Se o objeto estiver sendo empunhado por outra pessoa, ela pode fazer um teste de Vontade para negar o efeito, mas voc\xEA saber\xE1 onde o objeto est\xE1 e quem o est\xE1 carregando (ou sua apar\xEAncia, caso n\xE3o conhe\xE7a a pessoa). Por at\xE9 1h depois da convoca\xE7\xE3o, voc\xEA pode gastar uma a\xE7\xE3o de movimento para enviar o objeto de volta para o local em que ele estava antes.\n\nDiscente (+4 PE): muda o alvo para um objeto de at\xE9 10 espa\xE7os.\n\nVerdadeiro (+9 PE): muda o alvo para \u201C1 recipiente M\xE9dio (como uma mala ou caixote), com itens que somem at\xE9 10 espa\xE7os\u201D e a dura\xE7\xE3o para \u201Cpermanente\u201D. Em vez do normal, voc\xEA encanta o recipiente para mant\xEA-lo escondido no Outro Lado. Voc\xEA pode convocar o recipiente para um espa\xE7o livre adjacente, ou de volta para o esconderijo paranormal, como uma a\xE7\xE3o padr\xE3o. Para isso, voc\xEA deve ter em m\xE3os uma miniatura do objeto, que funciona como um utens\xEDlio de categoria II. Quando conjura esta vers\xE3o do ritual, voc\xEA perde 1 PE permanentemente."
    }, {
        name: "Convocar o Algoz",
        circle: "4",
        element: "Morte",
        execution: "padr\xE3o",
        range: "1,5m",
        target: "1 pessoa",
        duration: "sustentada",
        save: "Vontade parcial, Fortitude parcial",
        normalDice: "6d6",
        description: "Usando os medos subconscientes do alvo, voc\xEA manipula a espiral da Morte para criar uma imagem daquilo que ele mais teme. Apenas a pr\xF3pria v\xEDtima v\xEA o algoz com nitidez; outros seres presentes (incluindo voc\xEA) enxergam apenas um vulto sombrio. O algoz surge adjacente a voc\xEA. No fim de cada turno seu, ele flutua 12m em dire\xE7\xE3o \xE0 v\xEDtima. Se o algoz terminar o turno em alcance curto da v\xEDtima, ela deve fazer um teste de Vontade; se falhar, ficar\xE1 abalada. Se o algoz terminar o turno adjacente \xE0 v\xEDtima, ela deve fazer um teste de Fortitude. Se falhar, sofre um colapso e fica com 0 PV. Se passar, sofre 6d6 pontos de dano de Morte (este dano n\xE3o pode reduzir o alvo a menos de 1 PV). O algoz persegue o alvo implacavelmente, mesmo al\xE9m do alcance do ritual. Ele \xE9 incorp\xF3reo e imune a dano e s\xF3 desaparece se deixar o alvo morrendo ou se for dissipado."
    }, {
        name: "Corpo Adaptado",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa ou animal",
        duration: "cena",
        save: "Vontade parcial, Fortitude parcial",
        description: "Este ritual modifica a biologia do alvo para permitir a sobreviv\xEAncia em ambientes hostis. O alvo fica imune a calor e frio extremos, pode respirar na \xE1gua se respirar ar (ou vice-versa) e n\xE3o sufoca em fuma\xE7a densa.\n\nDiscente (+2 PE): muda a dura\xE7\xE3o para 1 dia.\n\nVerdadeiro (+5 PE): muda o alcance para \u201Ccurto\u201D e o alvo para \u201Cpessoas ou animais escolhidos\u201D."
    }, {
        name: "Decad\xEAncia",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        save: "Fortitude reduz \xE0 metade",
        normalDice: "2d8+2",
        discenteDice: "3d8+3",
        verdadeiroDice: "8d8+8",
        description: "Espirais de trevas envolvem sua m\xE3o e definham o alvo, que sofre 2d8+2 pontos de dano de Morte.\n\nDiscente (+2 PE): muda a resist\xEAncia para \u201Cnenhuma\u201D e o dano para 3d8+3. Como parte da execu\xE7\xE3o do ritual, voc\xEA transfere as espirais para uma arma e faz um ataque corpo a corpo contra o alvo com esta arma. Se acertar, causa o dano da arma e do ritual, somados.\n\nVerdadeiro (+5 PE): muda o alcance para \u201Cpessoal\u201D o alvo para \u201C\xE1rea: explos\xE3o com 6m de raio\u201D e o dano para 8d8+8. As espirais afetam todos os seres na \xE1rea. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Definhar",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "cena",
        save: "Fortitude parcial",
        description: "Voc\xEA dispara uma lufada de cinzas que drena as for\xE7as do alvo. A alvo fica fatigado. Se passar no teste de resist\xEAncia, em vez disso fica vulner\xE1vel.\n\nDiscente (+2 PE): em vez do normal, o alvo fica exausto. Se passar na resist\xEAncia, fica fatigado. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): como discente, mas muda o alvo para \u201Cat\xE9 5 seres\u201D. Requer 3\xBA c\xEDrculo e afinidade com Morte."
    }, {
        name: "Deflagra\xE7\xE3o de Energia",
        circle: "4",
        element: "Energia",
        execution: "completa",
        range: "pessoal",
        area: "explos\xE3o de 15m de raio",
        save: "Fortitude parcial",
        normalDice: "3d10",
        description: "Voc\xEA acumula uma quantidade imensa de Energia, ent\xE3o a libera em uma explos\xE3o intensa, como uma estrela em plena terra. Todos na \xE1rea sofrem 3d10 x 10 pontos de dano de Energia e todos os itens tecnol\xF3gicos (armas de fogo, acess\xF3rios e utens\xEDlios) param de funcionar (em termos de regras, est\xE3o quebrados). Voc\xEA n\xE3o \xE9 afetado pela explos\xE3o. Alvos que passem no teste de Fortitude sofrem metade do dano e seus itens voltam a funcionar ap\xF3s 1d4 rodadas.\n\nVerdadeiro (+5 PE): afeta apenas alvos a sua escolha."
    }, {
        name: "Desacelerar Impacto",
        circle: "2",
        element: "Morte",
        execution: "rea\xE7\xE3o",
        range: "curto",
        target: "1 ser ou objetos somando at\xE9 10 espa\xE7os",
        duration: "at\xE9 chegar ao solo ou cena, o que vier primeiro",
        description: "O alvo cai lentamente. A velocidade da queda \xE9 reduzida para 18m por rodada \u2014 o suficiente para n\xE3o causar dano. Como conjurar este ritual \xE9 uma rea\xE7\xE3o, voc\xEA pode conjur\xE1-lo r\xE1pido o bastante para salvar a si ou um aliado de quedas inesperadas. Se o alvo for um proj\xE9til \u2014 como um disparo de arma ou um objeto largado do alto de um pr\xE9dio \u2014, o ritual faz com que ele cause metade do dano normal, devido \xE0 lentid\xE3o.Este ritual s\xF3 funciona em alvos em queda livre ou similar; n\xE3o pode frear um golpe de faca ou o mergulho rasante de um atacante voador.\n\nDiscente (+3 PE): aumenta o total de alvos para seres ou objetos somando at\xE9 100 espa\xE7os."
    }, {
        name: "Descarnar",
        circle: "2",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        save: "Fortitude parcial",
        normalDice: "6d8",
        discenteDice: "10d8",
        description: "Este ritual cruel faz com que lacera\xE7\xF5es se manifestem na pele e \xF3rg\xE3os do alvo, que sofre 6d8 pontos de dano (metade corte, metade Sangue) e fica com uma hemorragia severa. No in\xEDcio de cada turno dele, o alvo deve fazer um teste de Fortitude. Se falhar, sofre 2d8 pontos de dano de Sangue. Se passar nesse teste dois turnos seguidos, a hemorragia \xE9 estancada. Alvos que passem no teste de resist\xEAncia inicial sofrem metade do dano e n\xE3o ficam com hemorragia.\n\nDiscente (+3 PE): muda o dano direto para 10d8 e o dano da hemorragia para 4d8. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): muda o alvo para voc\xEA e a dura\xE7\xE3o para sustentada. Enquanto o ritual durar, seus ataques corpo a corpo causam 4d8 pontos de dano de Sangue adicional e deixam o alvo com hemorragia automaticamente (como no efeito b\xE1sico do ritual). O alvo ainda tem direito a um teste de Fortitude no in\xEDcio de seus turnos. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Detec\xE7\xE3o de Amea\xE7as",
        circle: "2",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "pessoal",
        area: "esfera de 18m de raio",
        duration: "cena",
        description: "Voc\xEA recebe uma percep\xE7\xE3o agu\xE7ada sobre perigos \xE0 sua volta. Quando um ser hostil ou armadilha entra na \xE1rea do efeito, voc\xEA tem uma sensa\xE7\xE3o de perigo e pode gastar uma a\xE7\xE3o de movimento para fazer um teste de Percep\xE7\xE3o (DT 20). Se passar, sabe a dire\xE7\xE3o e dist\xE2ncia do perigo.\n\nDiscente (+3 PE): al\xE9m do normal, voc\xEA n\xE3o fica desprevenido contra perigos detectados e recebe +5 em testes de resist\xEAncia contra armadilhas. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda a dura\xE7\xE3o para \u201C1 dia\u201D e concede os mesmos benef\xEDcios de discente. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Disson\xE2ncia Ac\xFAstica",
        circle: "2",
        element: "Energia",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "esfera com 6m de raio",
        duration: "sustentada",
        description: "Voc\xEA manipula a vibra\xE7\xE3o do ar, criando uma \xE1rea de disson\xE2ncia sonora. Enquanto estiverem na \xE1rea, todos os seres ficam surdos. Essa disson\xE2ncia tamb\xE9m impede que seres dentro da \xE1rea conjurem rituais.\n\nDiscente (+1 PE): muda a \xE1rea para alvo de 1 objeto. Em vez do normal, o alvo emana uma \xE1rea de sil\xEAncio com 3m de raio. Se conjurar o ritual num objeto de um ser involunt\xE1rio, ele tem direito a um teste de Vontade para anul\xE1-la.\n\nVerdadeiro (+3 PE): muda a dura\xE7\xE3o para cena. Em vez do normal, nenhum som pode deixar a \xE1rea, mas seres dentro da \xE1rea podem falar, ouvir e conjurar rituais normalmente. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Dissipar Ritual",
        circle: "3",
        element: "Medo",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "1 ser ou objeto, ou esfera com 3m de raio",
        duration: "instant\xE2nea",
        description: "Voc\xEA dissipa rituais ativos, como se a dura\xE7\xE3o deles tivesse acabado. Efeitos de rituais instant\xE2neos n\xE3o podem ser dissipados (n\xE3o se pode dissipar uma \xE1rea de Paradoxo depois que j\xE1 causou dano...). Fa\xE7a um teste de Ocultismo; voc\xEA anula quaisquer rituais ativos no alvo ou na \xE1rea com DT igual ou menor que o resultado do teste. Voc\xEA pode conjurar esse ritual em um item amaldi\xE7oado para que se torne um item mundano (perdendo seus poderes) por um dia. Se o item estiver em posse de algu\xE9m, seu usu\xE1rio pode fazer um teste de Vontade para negar o efeito."
    }, {
        name: "Distorcer Apar\xEAncia",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        save: "Vontade desacredita",
        description: "Voc\xEA modifica sua apar\xEAncia f\xEDsica para se transformar em outra pessoa. Isso inclui altura, peso, tom de pele, cor de cabelo, timbre de voz, impress\xE3o digital, c\xF3rnea etc. Voc\xEA recebe +10 em testes de Engana\xE7\xE3o para disfarce, mas n\xE3o recebe habilidades da nova forma nem modifica suas demais estat\xEDsticas.\n\nDiscente (+2 PE): muda o alcance para \u201Ccurto\u201D e o alvo para \u201C1 ser\u201D. Um alvo involunt\xE1ria pode anular o efeito com um teste de Vontade.\n\nVerdadeiro (+5 PE): como em Discente, mas muda o alvo para \u201Cseres escolhidos\u201D. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Distor\xE7\xE3o Temporal",
        circle: "4",
        element: "Morte",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "veja texto",
        duration: "veja texto",
        description: "Este poderoso ritual distorce o fluxo de tempo em rela\xE7\xE3o a voc\xEA, criando um pequeno bols\xE3o temporal que dura 3 rodadas. Durante este tempo, voc\xEA pode agir livremente, mas n\xE3o pode se deslocar do lugar nem interagir com seres e objetos. Da mesma forma, efeitos cont\xEDnuos n\xE3o o afetam, e quaisquer efeitos que voc\xEA iniciar n\xE3o afetar\xE3o a \xE1rea ao seu redor. Efeitos de \xE1rea e com dura\xE7\xE3o maior que este efeito v\xE3o agir normalmente quando o bols\xE3o temporal acabar."
    }, {
        name: "Eco Espiral",
        circle: "2",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "2 rodadas",
        save: "Fortitude reduz \xE0 metade",
        description: "Voc\xEA manifesta em suas m\xE3os uma pequena c\xF3pia do alvo feita de cinzas. No in\xEDcio do pr\xF3ximo turno ap\xF3s conjurar este ritual, voc\xEA precisa gastar uma a\xE7\xE3o padr\xE3o para se concentrar nele; caso contr\xE1rio, ele se dissipa sem efeito. No in\xEDcio do segundo turno, voc\xEA precisa gastar uma a\xE7\xE3o padr\xE3o para descarreg\xE1-lo. Se fizer isso, a c\xF3pia explode e o alvo sofre dano de Morte igual a quantidade de dano que sofreu na rodada em que voc\xEA se concentrou (Fortitude reduz \xE0 metade). Se n\xE3o fizer, o ritual se dissipa sem efeito.\n\nDiscente (+3 PE): muda o alvo para \u201Cat\xE9 5 seres\u201D.\n\nVerdadeiro (+7 PE): muda a dura\xE7\xE3o para \u201Cat\xE9 3 rodadas\u201D, permitindo que voc\xEA se concentre nas duas primeiras e descarregue na terceira. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Eletrocuss\xE3o",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser ou objeto",
        duration: "instant\xE2nea",
        save: "Fortitude parcial",
        normalDice: "3d6",
        discenteDice: "6d6",
        verdadeiroDice: "8d6",
        description: "Voc\xEA manifesta e dispara uma corrente el\xE9trica contra o alvo, que sofre 3d6 pontos de dano de eletricidade e fica vulner\xE1vel por uma rodada. Se passar no teste de resist\xEAncia, sofre apenas metade do dano e evita a condi\xE7\xE3o. Se usado contra objetos eletr\xF4nicos, este ritual causa o dobro de dano e ignora resist\xEAncia.\n\nDiscente (+2 PE): muda o alvo para \u201C\xE1rea: linha de 30m\u201D. Voc\xEA dispara um poderoso raio que causa 6d6 pontos de dano de Energia em todos os seres e objetos livres na \xE1rea. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda a \xE1rea para \u201Calvos escolhidos\u201D. Em vez do normal, voc\xEA dispara v\xE1rios rel\xE2mpagos, um para cada alvo escolhido, causando 8d6 pontos de dano de Energia em cada. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Embaralhar",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Voc\xEA cria tr\xEAs c\xF3pias ilus\xF3rias que se parecem com hologramas extremamente realistas. As c\xF3pias ficam ao seu redor e imitam suas a\xE7\xF5es, tornando dif\xEDcil para um inimigo saber quem \xE9 o verdadeiro. Voc\xEA recebe +6 na Defesa. Cada vez que um ataque contra voc\xEA erra, uma das imagens desaparece e o b\xF4nus na Defesa diminui em 2. Um oponente deve ver as c\xF3pias para ser confundido. Se voc\xEA estiver invis\xEDvel, ou o atacante fechar os olhos, voc\xEA n\xE3o recebe o b\xF4nus (mas o atacante sofre as penalidades normais por n\xE3o enxergar).\n\nDiscente (+2 PE): muda o n\xFAmero de c\xF3pias para 5 (e o b\xF4nus na Defesa para +10). Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda o n\xFAmero de c\xF3pias para 8 (e o b\xF4nus na Defesa para +16). Al\xE9m do normal, toda vez que uma c\xF3pia \xE9 destru\xEDda, emite um clar\xE3o de luz. O ser que destruiu a c\xF3pia fica ofuscada por uma rodada. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Enfeiti\xE7ar",
        circle: "1",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 pessoa",
        duration: "cena",
        save: "Vontade anula",
        description: "Este ritual torna o alvo prestativo. Ele n\xE3o fica sob seu controle, mas percebe suas palavras e a\xE7\xF5es da maneira mais favor\xE1vel poss\xEDvel. Voc\xEA recebe um b\xF4nus de +10 em testes de Diplomacia com ele. Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resist\xEAncia. Se voc\xEA ou seus aliados tomarem qualquer a\xE7\xE3o hostil contra o alvo, o efeito \xE9 dissipado e o alvo retorna \xE0 atitude que tinha antes (ou piorada, de acordo com o mestre)Discente (+2 PE): em vez do normal, voc\xEA sugere uma a\xE7\xE3o para o alvo e ele obedece. A sugest\xE3o deve ser feita de modo que pare\xE7a aceit\xE1vel, a crit\xE9rio do mestre. Pedir que o alvo atire em seu companheiro, por exemplo, dissipa o efeito. J\xE1 sugerir a um guarda que descanse um pouco, de modo que voc\xEA e seus aliados passem por ele, \xE9 aceit\xE1vel. Quando o alvo executa a a\xE7\xE3o, o efeito termina. Voc\xEA pode determinar uma condi\xE7\xE3o espec\xEDfica para a sugest\xE3o: por exemplo, que o policial prenda a pr\xF3xima pessoa de casaco verde que ele encontrar. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): afeta todos os alvos dentro do alcance. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Esconder dos Olhos",
        circle: "2",
        element: "Conhecimento",
        execution: "livre",
        range: "pessoal",
        target: "voc\xEA",
        duration: "1 rodada",
        description: "Voc\xEA fica invis\xEDvel, incluindo seu equipamento, recebendo camuflagem total e +15 em testes de Furtividade. Como o normal, seres que n\xE3o possam v\xEA-lo ficam desprevenidos contra seus ataques.O efeito termina se voc\xEA faz um ataque ou usa uma habilidade hostil. A\xE7\xF5es contra objetos livres n\xE3o dissipam Esconder dos Olhos (voc\xEA pode tocar ou apanhar objetos que n\xE3o estejam sendo segurados por outros seres). Causar dano indiretamente \u2014 por exemplo, preparar explosivos para detonar mais tarde \u2014 n\xE3o \xE9 considerado um ataque.Objetos soltos voltam a ser vis\xEDveis e objetos apanhados por voc\xEA ficam invis\xEDveis. Uma luz transportada nunca fica invis\xEDvel (mesmo que sua fonte seja). Qualquer parte de um item carregado que se estenda al\xE9m de seu alcance corpo a corpo natural se torna vis\xEDvel.\n\nDiscente (+3 PE): muda a dura\xE7\xE3o para \u201Csustentada\u201D. Em vez do normal, voc\xEA gera uma esfera de invisibilidade. Voc\xEA e todos os aliados a at\xE9 3m de voc\xEA se tornam invis\xEDveis, como no efeito normal do ritual (ainda ficam vis\xEDveis caso fa\xE7am uma a\xE7\xE3o hostil). A esfera se move juntamente com voc\xEA; qualquer coisa que saia da esfera fica vis\xEDvel. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): muda a execu\xE7\xE3o para \u201Ca\xE7\xE3o padr\xE3o\u201D, o alcance para \u201Ctoque\u201D, o alvo para \u201C1 ser\u201D e a dura\xE7\xE3o para \u201Csustentada\u201D. O efeito n\xE3o \xE9 dissipado caso o alvo fa\xE7a um ataque ou a\xE7\xE3o hostil. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Espirais da Perdi\xE7\xE3o",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "cena",
        description: "Espirais surgem no corpo do alvo, tornando seus movimentos lentos. O alvo sofre \u20131d20 em testes de ataque.\n\nDiscente (+2 PE): muda a penalidade para \u20132d20. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+8 PE): muda a penalidade para -2d20. e o alvo para \u201Cseres escolhidos\u201D. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Ferver Sangue",
        circle: "3",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "sustentada",
        save: "Fortitude parcial",
        normalDice: "4d8",
        description: "O sangue do alvo aquece at\xE9 entrar em ebuli\xE7\xE3o. Quando o ritual \xE9 conjurado, e no in\xEDcio de cada turno do alvo, ele deve fazer um teste de Fortitude. Se falhar, sofre 4d8 pontos de dano de Sangue e fica fraco; se passar, sofre metade do dano e n\xE3o fica fraco neste turno. Se o alvo passar nesse teste dois turnos seguidos o efeito termina.\n\nVerdadeiro (+4 PE): muda o alvo para \u201Cseres escolhidos\u201D. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Fim Inevit\xE1vel",
        circle: "4",
        element: "Morte",
        execution: "completa",
        range: "extremo",
        effect: "buraco negro com 1,5m de di\xE2metro",
        duration: "4 rodadas",
        save: "Fortitude parcial",
        description: "Voc\xEA cria um v\xE1cuo em um espa\xE7o desocupado a sua escolha, capaz de sugar tudo nas proximidades. No in\xEDcio de cada um de seus quatro turnos seguintes, todos os seres a at\xE9 90m do v\xE1cuo, incluindo voc\xEA, devem fazer um teste de Fortitude. Em caso de falha, ficam ca\xEDdas e s\xE3o puxadas 30m na dire\xE7\xE3o do v\xE1cuo. Objetos soltos tamb\xE9m s\xE3o puxados. Seres podem gastar uma a\xE7\xE3o de movimento para se segurar em algum objeto fixo, recebendo +5 em seus testes de resist\xEAncia. Seres e objetos que iniciem seu turno tocando o v\xE1cuo temporal sofrem 100 pontos de dano de Morte por rodada.\n\nDiscente (+5 PE): muda a dura\xE7\xE3o para \u201C5 rodadas\u201D e o efeito para que voc\xEA n\xE3o seja afetado. Requer afinidade.\n\nVerdadeiro (+10 PE): muda a dura\xE7\xE3o para \u201C6 rodadas\u201D e o efeito para que seres escolhidos dentro do alcance n\xE3o sejam afetados. Requer afinidade."
    }, {
        name: "Flagelo de Sangue",
        circle: "2",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "cena",
        save: "Fortitude parcial",
        normalDice: "10d6",
        description: "Voc\xEA toca uma pessoa, gravando uma marca escarificada no corpo dela enquanto profere uma ordem, como \u201Cn\xE3o ataque a mim ou meus aliados\u201D, \u201Csiga-me\u201D ou \u201Cn\xE3o saia desta sala\u201D. A cada rodada que o alvo desobedecer a ordem, a marca inflige uma dor excruciante, que causa 10d6 pontos de dano de Sangue e deixa o alvo enjoado pela rodada (Fortitude reduz o dano \xE0 metade e evita a condi\xE7\xE3o). Se o alvo passar nesse teste dois turnos seguidos a marca desaparece.\n\nDiscente (+3 PE): muda o alvo para \u201C1 ser (exceto criaturas de Sangue)\u201D. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): como Discente, e muda a dura\xE7\xE3o para \u201C1 dia\u201D. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Forma Monstruosa",
        circle: "3",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Seu corpo e sua mente se transformam, assumindo uma forma monstruosa que combina suas caracter\xEDsticas com as de uma criatura de Sangue; suas roupas e prote\xE7\xE3o se mesclam \xE0 sua carne, transformando-se em uma coura\xE7a, e quaisquer objetos em suas m\xE3os se fundem aos seus bra\xE7os, transformando-se em garras afiadas e pontiagudas. Todo seu equipamento se funde \xE0 nova forma, ficando inacess\xEDvel, mas quaisquer b\xF4nus por equipamento se mant\xE9m. Seu tamanho muda para Grande e voc\xEA recebe +5 em testes de ataque e rolagens de dano corpo a corpo e 30 PV tempor\xE1rios. Enquanto estiver transformado, sua mente \xE9 tomada por f\xFAria selvagem; voc\xEA n\xE3o pode falar nem conjurar rituais e a cada rodada deve atacar o ser mais pr\xF3ximo poss\xEDvel (aliado ou inimigo). Se n\xE3o houver um ser em alcance de ataque, voc\xEA deve se deslocar em dire\xE7\xE3o ao ser mais pr\xF3ximo da melhor forma poss\xEDvel. Se o ser mais pr\xF3ximo for um aliado, voc\xEA pode fazer um teste de Vontade (DT igual \xE0 do ritual). Se passar, neste turno voc\xEA pode escolher qual ser atacar.\n\nDiscente (+3 PE): al\xE9m do normal, voc\xEA recebe imunidade a atordoamento, fadiga, sangramento, sono e veneno. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+9 PE): muda os b\xF4nus em testes de ataque e rolagens de dano para +10 e os PV tempor\xE1rios para 50. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Fortalecimento Sensorial",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Voc\xEA potencializa seus sentidos, recebendo +1d20 em Investiga\xE7\xE3o, Luta, Percep\xE7\xE3o e Pontaria.\n\nDiscente (+2 PE): al\xE9m do normal, seus inimigos sofrem \u20131d20 em testes de ataque contra voc\xEA. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): al\xE9m do normal, voc\xEA apura seus sentidos para perceber qualquer perigo ou amea\xE7a. Voc\xEA fica imune \xE0s condi\xE7\xF5es surpreendido e desprevenido e recebe +10 em Defesa e Reflexo. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Hemofagia",
        circle: "2",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        save: "Fortitude reduz \xE0 metade",
        normalDice: "6d6",
        verdadeiroDice: "4d6",
        description: "Voc\xEA arranca o sangue do corpo do alvo atrav\xE9s de pele dele, causando 6d6 pontos de dano de Sangue. Voc\xEA ent\xE3o absorve esse sangue, recuperando pontos de vida iguais \xE0 metade do dano causado.\n\nDiscente (+3 PE): muda a resist\xEAncia para \u201Cnenhuma\u201D. Como parte da execu\xE7\xE3o do ritual, voc\xEA pode usar uma arma em vez das m\xE3os para fazer um ataque corpo a corpo contra o alvo. Se acertar, causa o dano do ataque e do ritual, recuperando pontos de vida em quantidade igual \xE0 metade do dano total causado.\n\nVerdadeiro (+7 PE): muda o alcance para \u201Cpessoal\u201D, o alvo para \u201Cvoc\xEA\u201D e a dura\xE7\xE3o para \u201Ccena\u201D. Em vez do normal, a cada rodada voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para tocar 1 ser e causar 4d6 pontos de dano de Sangue. Voc\xEA recupera pontos de vida iguais \xE0 metade do dano causado. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Inexistir",
        circle: "4",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        save: "Vontade parcial",
        normalDice: "10d12+10",
        discenteDice: "15d12+15",
        verdadeiroDice: "20d12+20",
        description: "Este \xE9 um ritual extremamente cruel, que j\xE1 condenou grandes agentes da Ordem ao obl\xEDvio. Voc\xEA toca o alvo com a inten\xE7\xE3o de apag\xE1-lo completamente da exist\xEAncia, a mente e o corpo do alvo s\xE3o reescritos e desmantelados da exist\xEAncia. O alvo come\xE7a a levitar a poucos cent\xEDmetros do ch\xE3o e textos narrando todos os momentos de sua vida surgem e brilham por cima de sua pele, at\xE9 que a exist\xEAncia dele come\xE7a a ser destru\xEDda de dentro, causando 10d12+10 pontos de dano de Conhecimento. Se o alvo passar no teste de resist\xEAncia, em vez disso sofre 2d12 pontos de dano e fica debilitado por uma rodada. Independentemente do resultado do teste de resist\xEAncia, se os PV do alvo forem reduzidos a 0 ou menos, ele ser\xE1 completamente apagado, n\xE3o restando absolutamente nenhum tra\xE7o de sua exist\xEAncia.\n\nDiscente (+5 PE): muda o dano para 15d12+15 e o dano resistido para 3d12.\n\nVerdadeiro (+10 PE): muda o dano para 20d12+20 e o dano resistido para 4d12. Requer afinidade."
    }, {
        name: "Invadir Mente",
        circle: "2",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "m\xE9dio ou toque",
        target: "1 ser ou 2 pessoas volunt\xE1rias",
        duration: "instant\xE2nea ou 1 dia",
        save: "Vontade parcial ou nenhuma",
        normalDice: "6d6",
        discenteDice: "10d6",
        verdadeiroDice: "10d6",
        description: 'Quando conjura este ritual, voc\xEA gera um dos efeitos a seguir, a sua escolha: rajada mental (usa os primeiros par\xE2metros do cabe\xE7alho acima) ou liga\xE7\xE3o telep\xE1tica (usa os segundos par\xE2metros).Rajada Mental: voc\xEA infecta a mente do alvo com o Conhecimento proibido do Outro Lado, dilacerando o c\xE9rebro dele. O alvo sofre 6d6 pontos de dano de Conhecimento e fica atordoado por uma rodada. Se passar no teste de Vontade, sofre metade do dano e n\xE3o fica atordoado. Um mesmo alvo s\xF3 pode ficar atordoado por este ritual uma vez por cena.Liga\xE7\xE3o Telep\xE1tica: voc\xEA cria um elo mental entre duas pessoas (voc\xEA pode ser uma delas), que podem se comunicar independente da dist\xE2ncia pela dura\xE7\xE3o do ritual (1 dia).\n\nDiscente (+3 PE): se escolhar rajada mental, aumenta o dano para 10d6. Se escolher liga\xE7\xE3o telep\xE1tica, em vez do normal, voc\xEA cria um elo mental que permite que voc\xEA veja e ou\xE7a pelos sentidos do alvo, gastando uma a\xE7\xE3o de movimento para se concentrar. Um alvo involunt\xE1rio pode fazer um teste de Vontade para suprimir o ritual por uma hora. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+ 7 PE): se escolher rajada mental, aumenta o dano para 10d6 e muda o alvo para todos os "seres escolhidos". Se escolher liga\xE7\xE3o telep\xE1tica, voc\xEA pode criar um v\xEDnculo mental entre at\xE9 5 pessoas. Requer 4\xBA c\xEDrculo.'
    }, {
        name: "Inv\xF3lucro de Carne",
        circle: "4",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "curto",
        effect: "1 clone seu",
        duration: "cena",
        description: "Voc\xEA manifesta uma po\xE7a de sangue no ch\xE3o, de onde emerge uma c\xF3pia sua. Ela \xE9 id\xEAntica em apar\xEAncia e capacidades (em termos de jogo, tem as mesmas estat\xEDsticas) e surge com uma c\xF3pia de todo equipamento mundano que voc\xEA estiver carregando. A c\xF3pia n\xE3o tem consci\xEAncia (valor de Intelecto e Presen\xE7a nulos) e n\xE3o age sem que voc\xEA d\xEA uma ordem. Voc\xEA pode gastar uma a\xE7\xE3o de movimento para dar uma ordem \xE0 c\xF3pia, como \u201Clute contra aquele ser\u201D. No final de cada um de seus turnos, a c\xF3pia segue a ordem da melhor maneira poss\xEDvel, mas ainda \xE9 incapaz de tomar decis\xF5es sozinha e acatar\xE1 qualquer ordem perigosa sem hesitar, mesmo que leve \xE0 sua destrui\xE7\xE3o.Alternativamente, no in\xEDcio de seu turno, voc\xEA pode controlar ativamente a c\xF3pia. Se fizer isso, voc\xEA entra num transe tempor\xE1rio e assume o controle da c\xF3pia como se fosse seu corpo, usando os sentidos dela. Qualquer ser que interagir com a c\xF3pia tem direito a um teste de Percep\xE7\xE3o (DT do ritual) para perceber que \xE9 uma c\xF3pia. A c\xF3pia se desfaz em uma po\xE7a de sangue coagulado se chegar a 0 PV ou sair do alcance."
    }, {
        name: "L\xE2mina do Medo",
        circle: "4",
        element: "Medo",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        save: "Fortitude parcial",
        normalDice: "10d8",
        description: "Voc\xEA manifesta uma l\xE2mina imposs\xEDvel, que pode ser descrita apenas como uma \u201Cfenda na Realidade\u201D, com a qual golpeia um alvo adjacente. Se o alvo falhar no teste de Fortitude, seus PV s\xE3o reduzidos a 0 e ele fica morrendo; se passar, sofre 10d8 pontos de dano de Medo (ignora todas as resist\xEAncias) e fica apavorado por uma rodada. Se uma pessoa ficar morrendo pela L\xE2mina do Medo e sobreviver, o ferimento causado pelo ritual passa a se transformar constantemente, jamais cicatrizando e fazendo com que a pessoa passe a viver em dor constante. Aprender este ritual requer um poder de trilha espec\xEDfico."
    }, {
        name: "Localiza\xE7\xE3o",
        circle: "2",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "pessoal",
        area: "c\xEDrculo com 90m de raio",
        duration: "cena",
        description: "Esta ritual pode encontrar uma pessoa ou objeto a sua escolha. Voc\xEA pode pensar em termos gerais (\u201Cum policial\u201D, \u201Calgo de metal\u201D) ou espec\xEDficos (\u201CA delegada Joana\u201D, \u201Cuma pistola\u201D). O ritual indica a dire\xE7\xE3o e dist\xE2ncia da pessoa ou objeto mais pr\xF3ximo desse tipo, caso esteja ao alcance. Voc\xEA pode movimentar-se para continuar procurando. Procurar algo muito espec\xEDfico (\u201Ca chave do armaz\xE9m 4 no porto\u201D) exige que voc\xEA tenha em mente uma imagem precisa do objeto; caso a imagem n\xE3o seja parecida com a verdade, o ritual falha, mas voc\xEA gasta os PE mesmo assim. Este ritual pode ser bloqueado por uma fina camada de chumbo.\n\nDiscente (+3 PE): muda o alcance para \u201Ctoque\u201D, o alvo para \u201C1 pessoa\u201D e a dura\xE7\xE3o para \u201C1 hora\u201D. Em vez do normal, a pessoa tocada descobre o caminho mais direto para entrar ou sair de um lugar. Assim, o ritual pode ser usado para descobrir a rota at\xE9 o relic\xE1rio de uma catedral ou a sa\xEDda mais pr\xF3xima de uma caverna (mas n\xE3o para encontrar a localiza\xE7\xE3o de uma pessoa ou objeto; funciona apenas em rela\xE7\xE3o a lugares). Caso a pessoa demore mais de uma hora para percorrer o caminho, o conhecimento se perde.\n\nVerdadeiro (+7 PE): aumenta a \xE1rea para c\xEDrculo de 1km de raio. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Luz",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 objeto",
        duration: "cena",
        save: "Vontade anula",
        description: "O alvo emite luz de cores alternadas e brilhantes (mas n\xE3o produz calor) em uma \xE1rea com 9m de raio. O objeto pode ser guardado (em um bolso, por exemplo) para interromper a luz, que voltar\xE1 a funcionar caso o objeto seja revelado. Se o alvo for um objeto em posse de uma pessoa involunt\xE1ria, ela tem direito a um teste de Vontade para anular o efeito.\n\nDiscente (+2 PE): muda o alcance para longo e o efeito para 4 esferas brilhantes. Cria esferas flutuantes de pura luz com 10cm de di\xE2metro, que voc\xEA pode posicionar onde quiser dentro do alcance. Voc\xEA pode enviar uma esfera \xE0 frente, outra para tr\xE1s, outra para cima e manter uma perto de voc\xEA, por exemplo. Uma vez por rodada, voc\xEA pode mover as esferas com uma a\xE7\xE3o livre. Cada esfera ilumina uma \xE1rea de 6m de raio, mas n\xE3o produz calor. Se uma esfera ocupar o espa\xE7o de um ser, ele fica ofuscado e sua silhueta pode ser vista claramente (ela n\xE3o recebe camuflagem por escurid\xE3o ou invisibilidade). Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): a luz \xE9 c\xE1lida como a do sol. Dentro da \xE1rea seus aliados recebem +1d20 em testes de Vontade, e seus inimigos ficam ofuscados. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Medo Tang\xEDvel",
        circle: "4",
        element: "Medo",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "O ritual transforma seu corpo em uma manifesta\xE7\xE3o do Medo, tornando-o imune a efeitos mundanos. Voc\xEA fica imune \xE0s condi\xE7\xF5es atordoado, cego, debilitado, enjoado, envenenado, exausto, fatigado, fraco, lento, ofuscado e paralisado, al\xE9m de doen\xE7as e venenos, e n\xE3o sofre dano adicional por acertos cr\xEDticos e ataques furtivos. Al\xE9m disso, dano do tipo bal\xEDstico, corte, impacto ou perfura\xE7\xE3o n\xE3o podem reduzir seu total de pontos de vida abaixo de 1, tornando-o virtualmente imortal contra efeitos mundanos."
    }, {
        name: "Mergulho Mental",
        circle: "3",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "sustentada",
        save: "Vontade parcial",
        description: "Voc\xEA mergulha nos pensamentos do alvo, para descobrir informa\xE7\xF5es sobre ele. Durante o mergulho, voc\xEA fica desprevenido. No in\xEDcio de cada turno seu que estiver sustentando o efeito e tocando o alvo, ele deve fazer um teste de Vontade. Se falhar, deve responder uma pergunta sua que possa ser respondida com \u201Csim\u201D ou \u201Cn\xE3o\u201D, sendo incapaz de mentir. O que voc\xEA descobre depende das suas perguntas e do mestre: talvez voc\xEA n\xE3o descubra tudo que h\xE1 para saber, mas ganhe pistas para continuar a investiga\xE7\xE3o.\n\nVerdadeiro (+4 PE): muda a execu\xE7\xE3o para 1 dia, o alcance para ilimitado e adiciona como componente ritual\xEDstico uma cuba de ouro cheia d\u2019\xE1gua e uma m\xE1scara (acess\xF3rio de categoria II). Voc\xEA pode realizar o mergulho mental \xE0 dist\xE2ncia, submergindo seu rosto mascarado na \xE1gua enquanto mentaliza o alvo. Para que esse ritual funcione, voc\xEA precisa ter alguma informa\xE7\xE3o sobre o alvo, como nome completo, e um objeto pessoal ou fotografia. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Miasma Entr\xF3pico",
        circle: "2",
        element: "Morte",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "nuvem com 6m de raio",
        duration: "instant\xE2nea",
        save: "Fortitude parcial ",
        normalDice: "4d8",
        discenteDice: "6d8",
        description: "Cria uma explos\xE3o de emana\xE7\xF5es t\xF3xicas. Seres na \xE1rea sofrem 4d8 pontos de dano qu\xEDmico e ficam enjoados por 1 rodada. Se passarem na resist\xEAncia, sofrem metade do dano e n\xE3o ficam enjoados.\n\nDiscente (+3 PE): muda o dano para 6d8 de Morte.\n\nVerdadeiro (+7 PE): muda a dura\xE7\xE3o para 3 rodadas. Um ser que inicie seu turno dentro da \xE1rea sofre o dano novamente. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Nuvem de Cinzas",
        circle: "1",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        effect: "nuvem com 6m de raio e 6m de altura",
        duration: "cena",
        description: "Uma nuvem de fuligem espessa eleva-se de um ponto a sua escolha, obscurecendo toda a vis\xE3o \u2014 seres a at\xE9 1,5m t\xEAm camuflagem e seres a partir de 3m t\xEAm camuflagem total. Um vento forte dispersa a nuvem em 4 rodadas e um vendaval a dispersa em 1 rodada. A nuvem n\xE3o funciona sob a \xE1gua. Discente (+2 PE): voc\xEA pode escolher seres no alcance ao conjurar o ritual; eles enxergam atrav\xE9s do efeito. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): al\xE9m do normal, a nuvem fica espessa, quase s\xF3lida. Qualquer ser dentro dela tem seu deslocamento reduzido para 3m (independentemente de seu deslocamento normal) e sofre \u20132 em testes de ataque. Requer 3\xBA c\xEDrculo."
    }, {
        name: "\xD3dio Incontrol\xE1vel",
        circle: "1",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 pessoa",
        duration: "cena",
        description: "O alvo entra em um frenesi, aumentando sua agressividade e capacidade de luta. Ele recebe +2 em testes de ataque e rolagens de dano corpo a corpo e resist\xEAncia a bal\xEDstico, corte, impacto e perfura\xE7\xE3o 5. Enquanto o efeito durar, o alvo n\xE3o pode fazer nenhuma a\xE7\xE3o que exige calma e concentra\xE7\xE3o (como usar a per\xEDcia Furtividade ou conjurar rituais), e deve sempre atacar um alvo em sua rodada, mesmo que seja um aliado se ele for o \xFAnico a seu alcance.\n\nDiscente (+2 PE): al\xE9m do normal, sempre que o alvo usar a a\xE7\xE3o agredir, pode fazer um ataque corpo a corpo adicional contra o mesmo alvo.\n\nVerdadeiro (+5 PE): muda o b\xF4nus de ataque e dano para +5 e o alvo passa a sofrer apenas metade do dano dos tipos bal\xEDstico, corte, impacto e perfura\xE7\xE3o. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Ouvir os Sussurros",
        circle: "1",
        element: "Conhecimento",
        execution: "completa",
        range: "pessoal",
        target: "voc\xEA",
        duration: "instant\xE2nea",
        description: "O ritual conecta voc\xEA com os sussurros, mem\xF3rias ecoadas pelo Outro Lado, que voc\xEA pode consultar para receber conhecimento proibido em rela\xE7\xE3o a uma a\xE7\xE3o que tomar\xE1 em breve. Ao usar este ritual, fa\xE7a uma pergunta sobre um evento que voc\xEA est\xE1 prestes a fazer (na mesma cena) que possa ser respondida com \u201Csim\u201D ou \u201Cn\xE3o\u201D. O mestre rola 1d6 em segredo; com um resultado de 2 a 6, o ritual funciona e voc\xEA recebe sua resposta, que pode ser \u201Csim\u201D, \u201Cn\xE3o\u201D ou \u201Csim e n\xE3o\u201DCom um resultado 1, o ritual falha e oferece o resultado \u201Cn\xE3o\u201D. N\xE3o h\xE1 como saber se esse resultado foi dado porque o ritual falhou ou n\xE3o. Lan\xE7ar este ritual m\xFAltiplas vezes sobre o mesmo assunto gera sempre o primeiro resultado.Por exemplo, voc\xEA est\xE1 prestes a entrar em um pr\xE9dio que pode ser o esconderijo de um cultista. Se voc\xEA perguntar para os sussurros se o cultista est\xE1 mesmo nesse local, a resposta pode ser \u201Csim\u201D (ele est\xE1 no pr\xE9dio), \u201Cn\xE3o\u201D (ele n\xE3o est\xE1 no pr\xE9dio) ou \u201Csim e n\xE3o\u201D (ele est\xE1 no pr\xE9dio, mas usou um ritual para se esconder seu corpo f\xEDsico em uma dimens\xE3o do Outro Lado...). Isso \xE9 \xFAtil para saber se voc\xEA deve (ou n\xE3o) gastar recursos para um poss\xEDvel combate.\n\nDiscente (+2 PE): muda a execu\xE7\xE3o para 1 minuto. Em vez do normal, voc\xEA pode consultar os ecos fazendo uma pergunta sobre um evento que poder\xE1 acontecer at\xE9 um dia no futuro. O mestre rola a chance de falha; com um resultado de 2 a 6, voc\xEA recebe uma resposta, desde uma simples frase at\xE9 uma profecia ou enigma. Em geral, este uso oferece pistas, indicando um caminho a tomar para descobrir a resposta que se procura. Numa falha voc\xEA n\xE3o recebe resposta alguma. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+5 PE): muda a execu\xE7\xE3o para 10 minutos e a dura\xE7\xE3o para 5 rodadas. Em vez do normal, voc\xEA consulta os ecos, podendo fazer uma pergunta por rodada, desde que ela possa ser respondida com \u201Csim\u201D, \u201Cn\xE3o\u201D ou \u201Cningu\xE9m sabe\u201D. O mestre rola a chance de falha para cada pergunta. Em caso de falha, a resposta tamb\xE9m \xE9 \u201Cningu\xE9m sabe\u201D. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Paradoxo",
        circle: "2",
        element: "Morte",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "esfera com 6m de raio",
        duration: "instant\xE2nea",
        save: "Fortitude reduz \xE0 metade",
        normalDice: "6d6",
        discenteDice: "4d6",
        verdadeiroDice: "13d6",
        description: "O ritual cria uma poderosa implos\xE3o de distor\xE7\xE3o temporal contradit\xF3ria, causando 6d6 pontos de dano de Morte em todos os seres na \xE1rea.\n\nDiscente (+3 PE): muda a \xE1rea para \u201Cefeito: esfera com tamanho M\xE9dio\u201D e a dura\xE7\xE3o para cena. Em vez do normal, cria uma esfera de emana\xE7\xF5es espirais sibilantes com 1,5m de di\xE2metro que causa 4d6 pontos de dano de Morte a qualquer ser no mesmo espa\xE7o. Voc\xEA pode gastar uma a\xE7\xE3o de movimento para fazer a esfera voar 9m em qualquer dire\xE7\xE3o. Um ser s\xF3 pode sofrer dano da esfera uma vez por rodada.\n\nVerdadeiro (+7 PE): muda o dano para 13d6. Seres reduzidos a 0 PV pelo dano do Paradoxo devem fazer um teste de Fortitude. Se falharam, s\xE3o reduzidas a cinzas (morrem imediatamente). Requer 4\xBA c\xEDrculo."
    }, {
        name: "Perturba\xE7\xE3o",
        circle: "1",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 pessoa",
        duration: "1 rodada",
        save: "Vontade (anula)",
        discenteDice: "3d8",
        description: "Voc\xEA d\xE1 uma ordem que o alvo deve ser capaz de ouvir (mas n\xE3o precisa entender). Se falhar na resist\xEAncia, ele deve obedecer \xE0 ordem em seu pr\xF3prio turno da melhor maneira poss\xEDvel. Escolha um dos efeitos.Fuja: O alvo gasta seu turno tentando se afastar de voc\xEA (usando todas as suas a\xE7\xF5es).Largue: O alvo solta quaisquer itens que esteja segurando e n\xE3o pode peg\xE1-los novamente at\xE9 o in\xEDcio de seu pr\xF3ximo turno. Como esta \xE9 uma a\xE7\xE3o livre, ele ainda pode executar outras a\xE7\xF5es (exceto pegar aquilo que largou).Pare: O alvo fica pasmo (n\xE3o pode realizar a\xE7\xF5es, s\xF3 rea\xE7\xF5es).Sente-se: Com uma a\xE7\xE3o livre, o alvo se senta no ch\xE3o (se estava pendurado ou voando, desce at\xE9 o ch\xE3o). Ele pode fazer outras a\xE7\xF5es, mas n\xE3o se levantar at\xE9 o in\xEDcio de seu pr\xF3ximo turno.Venha: O alvo gasta seu turno se aproximando de voc\xEA (usando todas as suas a\xE7\xF5es).\n\nDiscente (+2 PE): muda o alvo para \u201C1 ser\u201D e adiciona o seguinte comando: \u201CSofra. O alvo \xE9 acometido de dor aguda, sofrendo 3d8 de dano de Conhecimento e ficando abalado por uma rodada\u201D.\n\nVerdadeiro (+5 PE): muda o alvo para \u201Cat\xE9 5 seres\u201D ou adiciona o seguinte comando: \u201CAtaque. O alvo deve fazer a a\xE7\xE3o agredir contra um outro alvo a sua escolha em alcance m\xE9dio, com todas as suas capacidades\u201D. Requer 3\xBA c\xEDrculo e afinidade."
    }, {
        name: "Poeira da Podrid\xE3o",
        circle: "3",
        element: "Morte",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "nuvem com 6m de raio",
        duration: "sustentada",
        save: "Fortitude",
        normalDice: "4d8",
        verdadeiroDice: "4d8+16",
        description: "Voc\xEA manifesta uma nuvem de poeira que apodrece os seres na \xE1rea. Ao conjurar a ritual, e no in\xEDcio de cada um de seus turnos, seres e objetos na \xE1rea sofrem 4d8 pontos de dano de Morte (Fortitude reduz \xE0 metade). Alvos que falharem no teste tamb\xE9m n\xE3o podem recuperar PV de nenhuma forma por uma rodada.\n\nVerdadeiro (+4 PE): muda o dano para 4d8+16."
    }, {
        name: "Polariza\xE7\xE3o Ca\xF3tica",
        circle: "1",
        element: "Energia",
        execution: "padr\xE3o",
        range: "curto",
        target: "voc\xEA",
        duration: "sustentada",
        save: "Vontade anula",
        description: "Voc\xEA gera uma aura magn\xE9tica sobrenatural. Escolha um dos efeitos a seguir.Atrair: voc\xEA pode usar uma a\xE7\xE3o de movimento para puxar um objeto met\xE1lico de espa\xE7o 2 ou menor dentro do alcance. Se o objeto estiver livre, voa para suas m\xE3os (caso tenha m\xE3os livres para apanh\xE1-lo) ou para seus p\xE9s.Repelir: voc\xEA repele objetos de espa\xE7o 2 ou menor (o que envolve quase todos os proj\xE9teis e armas de arremesso), recebendo resist\xEAncia a bal\xEDstico, corte, impacto e perfura\xE7\xE3o 5.\n\nDiscente (+2 PE): nesta vers\xE3o a energia magn\xE9tica \xE9 expelida de uma \xFAnica vez e arremessa at\xE9 10 objetos, ou um total de 10 espa\xE7os, o que for menor. Os objetos devem estar a at\xE9 3m uns dos outros. Objetos arremessados podem atingir seres em seu caminho, causando de 1 ponto de dano de impacto por espa\xE7o (objetos macios, sem pontas ou sem fio) at\xE9 1d6 pontos de dano por espa\xE7o (objetos duros, pontudos ou afiados). Seres atingidos t\xEAm direito a um teste de Reflexos para reduzir o dano \xE0 metade. Seres dentro da capacidade de carga do efeito podem ser arremessadas, mas t\xEAm direito a um teste de Vontade para evitar o efeito (em si mesmos ou em objetos que estejam segurando). Um ser arremessado contra uma superf\xEDcie s\xF3lida sofre 1d6 pontos de dano de impacto para cada 3m que \u201Cvoou\u201D no deslocamento (incluindo outros seres; nesse caso, ambos sofrem o dano).\n\nVerdadeiro (+5 PE): muda o alcance para m\xE9dio. Voc\xEA pode usar uma a\xE7\xE3o de movimento para fazer com que a for\xE7a magn\xE9tica levite e mova um ser ou objeto de espa\xE7o 10 ou menor por at\xE9 9m em qualquer dire\xE7\xE3o dentro do alcance. Um ser pode anular o efeito sobre ele, ou sobre um objeto que possua, passando num teste de Vontade. O alvo cai no ch\xE3o se sair do alcance ou o efeito terminar."
    }, {
        name: "Possess\xE3o",
        circle: "4",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "longo",
        target: "1 pessoa viva ou morta",
        duration: "1 dia",
        save: "Vontade anula",
        description: "Voc\xEA projeta sua consci\xEAncia no corpo de uma pessoa viva ou morta. Enquanto possuir o alvo, voc\xEA assume o controle total do corpo dele (se o alvo estiver vivo, a consci\xEAncia dele troca de lugar com a sua, ficando inerte dentro do seu corpo desacordado). Em termos de jogo, voc\xEA continua usando a sua ficha, mas com os atributos f\xEDsicos (Agilidade, For\xE7a e Vigor) e deslocamento do alvo. Se o alvo passar no teste de resist\xEAncia, sabe que voc\xEA tentou possu\xED-lo e fica imune a este ritual por um dia. Caso qualquer um dos envolvidos no ritual morra, a mente sobrevivente ficar\xE1 permanentemente presa no corpo novo, a n\xE3o ser que use o ritual novamente para voltar a seu corpo antigo. Retornar para o seu corpo voluntariamente \xE9 uma a\xE7\xE3o livre."
    }, {
        name: "Presen\xE7a do Medo",
        circle: "4",
        element: "Medo",
        execution: "padr\xE3o",
        range: "pessoal",
        area: "emana\xE7\xE3o de 9m de raio",
        duration: "sustentada",
        normalDice: "5d8+5d8",
        description: "Voc\xEA se torna um recept\xE1culo para o Medo puro, emanando ondas de pavor e ru\xEDna. Alvos dentro da \xE1rea no momento da conjura\xE7\xE3o ou no in\xEDcio de cada um de seus turnos s\xE3o acometidos por sofrimento intenso e sofrem 5d8 de dano mental e 5d8 de dano de Medo (Vontade reduz ambos \xE0 metade). Alvos que falharem no teste ficam atordoados por uma rodada (este efeito funciona apenas uma vez por cena)."
    }, {
        name: "Prote\xE7\xE3o contra Rituais",
        circle: "2",
        element: "Medo",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "cena",
        description: "Voc\xEA canaliza uma aura de Medo puro, que protege o alvo contra efeitos paranormais. O alvo recebe resist\xEAncia a paranormal 5 e +5 em testes de resist\xEAncia contra rituais e habilidades de criaturas paranormais.\n\nDiscente (+3 PE): muda o alvo para \u201Cat\xE9 5 seres tocados\u201D. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro(+6 PE): muda o alvo para \u201Cat\xE9 5 seres tocados\u201D, a resist\xEAncia a dano para 10 e o b\xF4nus em testes de resist\xEAncia para +10. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Purgat\xF3rio",
        circle: "3",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "curto",
        target: "\xE1rea de 6m de raio",
        duration: "sustentada",
        save: "Fortitude parcial ",
        normalDice: "6d6",
        description: "Voc\xEA faz brotar uma po\xE7a de sangue pegajoso na \xE1rea afetada. Inimigos na \xE1rea se tornam vulner\xE1veis a dano bal\xEDstico, de corte, de impacto e de perfura\xE7\xE3o. Um alvo que tente sair da \xE1rea \xE9 acometido de uma dor terr\xEDvel; sofre 6d6 pontos de dano de Sangue e deve fazer um teste de Fortitude. Se passar, consegue sair. Se falhar, a dor faz com que n\xE3o consiga se mover e perca a a\xE7\xE3o de movimento."
    }, {
        name: "Rejeitar N\xE9voa",
        circle: "2",
        element: "Medo",
        execution: "padr\xE3o",
        range: "curto",
        area: "nuvem de 6m de raio",
        duration: "cena",
        description: "Voc\xEA manifesta um leve redemoinho de n\xE9voa que se movimenta suavemente dentro da \xE1rea. Rituais conjurados dentro da \xE1rea t\xEAm seu custo aumentado em +2 PE por c\xEDrculo e sua execu\xE7\xE3o aumentada em um passo (de livre para movimento, de movimento para padr\xE3o, de padr\xE3o para completa, de completa para duas rodadas). Rejeitar a N\xE9voa anula os efeitos de Ciner\xE1ria, a menos que o conjurador de Ciner\xE1ria use uma a\xE7\xE3o completa por rodada para manter o ritual ativo, neutralizando o efeito dos dois rituais.\n\nDiscente (+2 PE): al\xE9m do normal, a DT de testes de resist\xEAncia contra rituais realizados na \xE1rea diminui em \u20135.\n\nVerdadeiro (+ 5 PE): como discente, e o dano causado dentro da n\xE9voa por rituais \xE9 sempre m\xEDnimo."
    }, {
        name: "Salto Fantasma",
        circle: "3",
        element: "Energia",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        target: "voc\xEA",
        duration: "instant\xE2nea",
        description: "Seu corpo se transforma momentaneamente em Energia pura e viaja at\xE9 outro ponto. Voc\xEA n\xE3o precisa perceber nem ter linha de efeito ao seu destino, podendo simplesmente imagin\xE1-lo, desde que j\xE1 tenha observado o local de alguma forma (pessoalmente, por fotografia, por v\xEDdeo...). Por exemplo, pode se transportar 3m adiante para ultrapassar uma porta fechada. Uma vez transportado, voc\xEA n\xE3o pode agir pelo resto do seu turno. Este ritual n\xE3o permite que voc\xEA apare\xE7a dentro de um corpo s\xF3lido; se o ponto de chegada n\xE3o tem espa\xE7o livre, voc\xEA ressurge na \xE1rea vazia mais pr\xF3xima.\n\nDiscente (+2 PE): muda a execu\xE7\xE3o para rea\xE7\xE3o. Em vez do normal, voc\xEA salta para um espa\xE7o adjacente (1,5m), recebendo +10 na Defesa e em testes de Reflexos contra um ataque ou efeito que esteja prestes a atingi-lo.\n\nVerdadeiro (+4 PE): muda o alcance para longo e o alvo para voc\xEA e at\xE9 dois outros seres volunt\xE1rios que voc\xEA esteja tocando."
    }, {
        name: "Sopro do Caos",
        circle: "2",
        element: "Energia",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "varia",
        duration: "sustentada",
        save: "veja texto",
        description: "Voc\xEA altera os movimentos de massas de ar de forma ca\xF3tica. Ao conjurar o ritual, escolha um dos efeitos abaixo.Ascender: cria uma corrente de ar ascendente capaz de erguer do ch\xE3o um ser ou objeto M\xE9dio, fazendo o alvo flutuar para cima e para baixo conforme sua vontade. Voc\xEA pode gastar uma a\xE7\xE3o de movimento para subir ou descer o alvo at\xE9 6m por rodada, at\xE9 um m\xE1ximo de 30m de altura. Voc\xEA n\xE3o pode mover o alvo horizontalmente \u2014 mas o alvo pode, por exemplo, escalar uma colina ou se apoiar no teto para mover-se lateralmente (com metade de seu deslocamento normal). Um ser levitando fica vulner\xE1vel. Alvos involunt\xE1rios t\xEAm direito a um teste de Fortitude no in\xEDcio de cada um de seus turnos para encerrar o efeito. Derrubar um alvo flutuando (simplesmente parando a corrente de ar) causa o dano normal de queda, mas um alvo que passe no teste pode \u201Cnadar\u201D para o ch\xE3o contra a corrente. Voc\xEA pode usar essa op\xE7\xE3o para fazer uma manobra derrubar contra um alvo voador dentro do alcance, usando Ocultismo em vez de Luta.Sopro: cria uma lufada de vento a partir de suas m\xE3os, que empurra qualquer alvo M\xE9dio ou menor, em um cone de 4,5m \u2014 fa\xE7a uma manobra empurrar usando Ocultismo em vez de Luta, usando uma mesma rolagem sua para todos os alvos. A lufada de vento tamb\xE9m faz qualquer coisa que um vento forte e s\xFAbito faria, como levantar p\xF3, dispersar vapores, apagar chamas, espalhar pap\xE9is ou mover uma embarca\xE7\xE3o. Manter o sopro ativo exige uma a\xE7\xE3o padr\xE3o no seu turno.Vento: cria uma \xE1rea de vento forte dentro do alcance. Se conjurada numa \xE1rea que j\xE1 esteja com algum efeito de vento, aumenta esse efeito em um passo. Manter o vento ativo requer uma a\xE7\xE3o de movimento. Voc\xEA tamb\xE9m pode usar essa op\xE7\xE3o para reduzir os efeitos de vento em uma \xE1rea.\n\nDiscente (+3 PE): passa a afetar alvos Grandes.\n\nVerdadeiro (+9 PE): passa a afetar alvos Enormes."
    }, {
        name: "Tecer Ilus\xE3o",
        circle: "1",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        effect: "ilus\xE3o que se estende a at\xE9 4 cubos de 1,5m",
        duration: "cena",
        save: "Vontade desacredita",
        verdadeiroDice: "6d6",
        description: "Este ritual cria uma ilus\xE3o visual (uma pessoa, uma parede...) ou sonora (um grito de socorro, um uivo assustador...). O ritual cria apenas imagens ou sons simples, com volume equivalente \xE0 voz de uma pessoa para cada cubo de 1,5m no efeito. N\xE3o \xE9 poss\xEDvel criar cheiros, texturas ou temperaturas, nem sons complexos, como uma m\xFAsica ou di\xE1logo. Seres e objetos atravessam uma ilus\xE3o sem sofrer dano, mas o ritual pode, por exemplo, esconder uma armadilha ou emboscada. A ilus\xE3o \xE9 dissipada se voc\xEA sair do alcance.\n\nDiscente (+2 PE): muda o efeito para at\xE9 8 cubos de 1,5m e a dura\xE7\xE3o para sustentada. Voc\xEA pode criar ilus\xF5es de imagem e sons combinados, e pode criar sons complexos, odores e sensa\xE7\xF5es t\xE9rmicas. Tamb\xE9m pode criar sensa\xE7\xF5es t\xE1teis, como texturas; objetos ainda atravessam a ilus\xE3o, mas seres n\xE3o conseguem atravess\xE1-la sem passar em um teste de Vontade. A cada rodada, voc\xEA pode usar uma a\xE7\xE3o livre para mover a imagem ou alterar o som, como aumentar o volume ou fazer com que pare\xE7a se afastar ou se aproximar, ainda dentro dos limites do efeito. Voc\xEA pode, por exemplo, criar a ilus\xE3o de um fantasma que anda pela sala, controlando seus movimentos. A ilus\xE3o ainda \xE9 incapaz de causar ou sofrer dano. Quando voc\xEA para de sustentar o ritual, a imagem ou som persistem por mais uma rodada antes do ritual se dissipar. Requer 2\xBA c\xEDrculo.\n\nVerdadeiro (+ 5 PE): voc\xEA cria a ilus\xE3o de um perigo mortal. Quando o ritual \xE9 conjurado, e no in\xEDcio de cada um de seus turnos, um alvo interagindo com a ilus\xE3o deve fazer um teste de Vontade; se falhar, acredita que a ilus\xE3o \xE9 real e sofre 6d6 pontos de dano de Conhecimento. O alvo racionaliza o efeito sempre que falha no teste (por exemplo, acredita que o mesmo teto pode cair sobre ele v\xE1rias vezes). Se um alvo passar em dois testes de Vontade seguidos, o efeito \xE9 anulado para ele. Requer 3\xBA c\xEDrculo."
    }, {
        name: "Tela de Ru\xEDdo",
        circle: "2",
        element: "Energia",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Este ritual cria uma pel\xEDcula de energia que recobre seu corpo e absorve energia cin\xE9tica. Voc\xEA recebe 30 PV tempor\xE1rios, mas apenas contra dano bal\xEDstico, de corte, de impacto ou de perfura\xE7\xE3o.Alternativamente, voc\xEA pode conjurar este ritual como uma rea\xE7\xE3o quando sofrer dano, recebendo resist\xEAncia 15 apenas contra esse dano.\n\nDiscente (+3 PE): aumenta os PV tempor\xE1rio para 60 e a resist\xEAncia para 30.\n\nVerdadeiro (+7 PE): muda o alcance para curto e o alvo para 1 ser ou objeto Enorme ou menor. Em vez do normal, cria uma esfera im\xF3vel e tremeluzente com o tamanho do alvo e centrada nele. Nenhum ser, objeto ou efeito de dano pode passar pela esfera, embora seres possam respirar normalmente dentro dela. O alvo tem direito a um teste de Reflexo para evitar ser aprisionado. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Teletransporte",
        circle: "4",
        element: "Energia",
        execution: "padr\xE3o",
        range: "toque",
        target: "at\xE9 5 seres volunt\xE1rios",
        duration: "instant\xE2nea",
        description: "O ritual transforma o corpo e equipamento dos alvos em energia pura e os faz reaparecer num lugar a sua escolha a at\xE9 1.000km. Quando conjura este ritual, voc\xEA precisa fazer um teste de Ocultismo, com DT definida pelo seu conhecimento sobre o destino.DT 25. Um lugar que voc\xEA visita com frequ\xEAncia.DT 30. Um lugar que voc\xEA j\xE1 visitou pelo menos uma vez.DT 35. Um lugar que voc\xEA nunca visitou e s\xF3 conhece a partir da descri\xE7\xE3o de outra pessoa que esteve l\xE1.Voc\xEA n\xE3o pode se teletransportar para um lugar que nunca visitou sem a descri\xE7\xE3o de algu\xE9m. Ou seja, n\xE3o pode se transportar para \u201Co local onde J\xFAlia est\xE1 presa\u201D se nunca esteve l\xE1 nem falou com algu\xE9m que esteve.Se passar no teste, os alvos chegam ao lugar desejado. Se falhar, voc\xEA chega em um lugar parecido,mas errado ou distante (at\xE9 1d10 x 10 km). Se voc\xEA falhar por 5 ou mais, o ritual falha, mas voc\xEA gasta PE normalmente e fica atordoado por 1d4 rodadas.\n\nVerdadeiro (+5 PE): pode se teletransportar para qualquer local na Terra."
    }, {
        name: "Tent\xE1culos de Lodo",
        circle: "3",
        element: "Morte",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        area: "c\xEDrculo com 6m de raio",
        duration: "cena",
        normalDice: "4d6",
        verdadeiroDice: "6d6",
        description: "Uma fenda sombria se abre no ch\xE3o, de onde surgem tent\xE1culos feitos de lodo da Morte. Ao conjurar o ritual e no in\xEDcio de cada um de seus turnos, voc\xEA faz um teste da manobra agarrar (usando Ocultismo em vez de Luta) contra cada alvo na \xE1rea. Se voc\xEA vencer, o ser \xE9 agarrado; se j\xE1 estava agarrado, \xE9 esmagado, sofrendo 4d6 pontos de dano (metade impacto, metade Morte). A \xE1rea do ritual conta como terreno dif\xEDcil. Os tent\xE1culos s\xE3o imunes a dano.\n\nVerdadeiro (+5 PE): aumenta o raio da \xE1rea para 9m e aumenta o dano dos tent\xE1culos para 6d6."
    }, {
        name: "Terceiro Olho",
        circle: "1",
        element: "Conhecimento",
        execution: "padr\xE3o",
        range: "pessoal",
        target: "voc\xEA",
        duration: "cena",
        description: "Seus olhos se enchem de sigilos e voc\xEA passa a enxergar auras paranormais em alcance longo. Rituais, itens amaldi\xE7oados e criaturas emitem auras. Voc\xEA sabe o elemento da aura e seu poder aproximado \u2014 rituais de 1\xBA c\xEDrculo e criaturas de VD at\xE9 80 emitem uma aura fraca; rituais de 2\xBA e 3\xBA c\xEDrculos e criaturas de VD entre 81 e 280 emitem uma aura moderada, e rituais de 4\xBA c\xEDrculo e criaturas de VD 281 ou maior emitem uma aura poderosa.Al\xE9m disso, voc\xEA pode gastar uma a\xE7\xE3o de movimento para descobrir se um ser que possa ver em alcance m\xE9dio tem poderes paranormais ou se \xE9 capaz de conjurar rituais e de quais elementos.\n\nDiscente (+2 PE): muda a dura\xE7\xE3o para 1 dia.\n\nVerdadeiro (+5 PE): tamb\xE9m pode enxergar objetos e seres invis\xEDveis, que aparecem como formas transl\xFAcidas."
    }, {
        name: "Transfigurar \xC1gua",
        circle: "3",
        element: "Energia",
        execution: "padr\xE3o",
        range: "longo",
        area: "esfera com 30m de raio",
        duration: "cena",
        save: "veja texto",
        normalDice: "5d8",
        verdadeiroDice: "10d8",
        description: "Voc\xEA canaliza Energia sobre um corpo de \xE1gua, para que ele adquira movimentos e comportamentos paranormais e ca\xF3ticos. Ao conjurar o ritual, escolha um dos seguintes efeitos.Congelar: toda a \xE1gua mundana na \xE1rea \xE9 congelada. Seres nadando na \xE1rea ficam im\xF3veis; escapar exige gastar uma a\xE7\xE3o padr\xE3o e passar num teste de Atletismo (DT igual a do ritual).Derreter: gelo mundano na \xE1rea vira \xE1gua e o ritual termina. A crit\xE9rio do mestre, isso pode criar terreno dif\xEDcil.Enchente: eleva o n\xEDvel da \xE1gua mundana na \xE1rea em at\xE9 4,5m. A sua escolha, muda \xE1rea para \u201Calvo: uma embarca\xE7\xE3o\u201D. O alvo recebe +6m em seu deslocamento pela dura\xE7\xE3o do efeito.Evaporar: toda a \xE1gua e gelo mundano na \xE1rea evaporam instantaneamente e o ritual termina. Qualquer ser vivo na \xE1rea sofre 5d8 de dano de Energia (Fortitude reduz \xE0 metade). Criaturas de Morte sofrem o dobro desse dano.Partir: diminui o n\xEDvel de toda \xE1gua mundana na \xE1rea em at\xE9 4,5m. Em um corpo d\u2019\xE1gua raso, isso abre um caminho seco, que pode ser atravessado a p\xE9. Em um corpo d\u2019\xE1gua profundo, cria um redemoinho que pode prender barcos (um teste de Pilotagem com DT igual \xE0 do ritual permite ao piloto livrar a embarca\xE7\xE3o).\n\nVerdadeiro (+5 PE): aumenta o deslocamento de enchente para +12m e o dano de evaporar para 10d8."
    }, {
        name: "Transfigurar Terra",
        circle: "3",
        element: "Energia",
        execution: "padr\xE3o",
        range: "longo",
        area: "9 cubos com 1,5m de lado",
        duration: "instant\xE2nea",
        save: "veja texto",
        normalDice: "10d6",
        description: "Voc\xEA imbui terra, pedra, lama, argila ou areia na \xE1rea com Energia, gerando efeitos sobrenaturais e ca\xF3ticos. Ao conjurar o ritual, escolha um dos seguintes efeitos.Amolecer: se afetar o teto, uma coluna ou suporte, provoca um desabamento que causa 10d6 pontos de dano de impacto aos seres na \xE1rea (Reflexos reduz \xE0 metade). Se afetar um piso de terra ou pedra, cria terreno dif\xEDcil de areia ou argila, respectivamente.Modelar: pode usar pedra ou argila para criar um ou mais objetos simples de tamanho Enorme ou menor (sem mecanismos ou partes m\xF3veis). Por exemplo, pode transformar um tijolo em um martelo, criar uma passagem onde antes havia apenas uma parede ou levantar uma ou mais paredes que oferecem cobertura total (RD 8 e 50 PV para cada 3m).Solidificar: transforma lama ou areia em terra ou pedra. Seres com os p\xE9s na superf\xEDcie ficam agarrados. Eles podem se soltar com uma a\xE7\xE3o padr\xE3o e um teste de Atletismo (DT igual a do ritual).\n\nDiscente (+3 PE): muda a \xE1rea para 15 cubos com 1,5m de lado.\n\nVerdadeiro (+7 PE): tamb\xE9m afeta todos os tipos de minerais e metais. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Transfus\xE3o Vital",
        circle: "2",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "toque",
        target: "1 ser",
        duration: "instant\xE2nea",
        description: "Voc\xEA toca no alvo e transfere sua pr\xF3pria energia vital para ele, podendo sofrer at\xE9 30 pontos de dano de Sangue para que o alvo recupere a mesma quantidade em PV. Voc\xEA n\xE3o pode ficar com menos de 1 PV por causa desse ritual.\n\nDiscente (+3 PE): Voc\xEA pode transferir at\xE9 50 pontos de vida. Requer 3\xBA c\xEDrculo.\n\nVerdadeiro (+7 PE): Voc\xEA pode transferir at\xE9 100 pontos de vida. Requer 4\xBA c\xEDrculo."
    }, {
        name: "Velocidade Mortal",
        circle: "2",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "sustentada",
        description: "Voc\xEA distorce a passagem do tempo ao redor do alvo, tornando-o extremamente veloz. O alvo pode realizar uma a\xE7\xE3o de movimento adicional por turno. Esta a\xE7\xE3o n\xE3o pode ser usada para conjurar rituais.\n\nDiscente (+3 PE): em vez de uma a\xE7\xE3o de movimento, o alvo recebe uma a\xE7\xE3o padr\xE3o adicional por turno.\n\nVerdadeiro (+7 PE): muda o alvo para \u201Calvos escolhidos\u201D. Requer 4\xBA c\xEDrculo e afinidade."
    }, {
        name: "Vid\xEAncia",
        circle: "3",
        element: "Conhecimento",
        execution: "completa",
        range: "ilimitado",
        target: "1 ser",
        duration: "5 rodadas",
        save: "Vontade anula",
        description: "Atrav\xE9s de uma superf\xEDcie reflexiva, como um espelho ou mesmo uma TV desligada, voc\xEA pode ver e ouvir um ser escolhido e seus arredores (cerca de 6m em qualquer dire\xE7\xE3o). O alvo pode estar a qualquer dist\xE2ncia, mas tem direito a um teste de resist\xEAncia no in\xEDcio de cada um de seus turnos para impedir a Vid\xEAncia naquele turno. Se o alvo passar em dois testes seguidos, o ritual \xE9 encerrado e o alvo fica imune a ele por uma semana. Para esse ritual funcionar, voc\xEA precisa ter alguma informa\xE7\xE3o sobre o alvo, como seu nome ou uma foto. Dependendo do conhecimento que voc\xEA tiver dele, o alvo recebe b\xF4nus ou penalidades em seu teste de resist\xEAncia.Voc\xEA sabe o m\xEDnimo sobre o alvo: +10Voc\xEA possui algumas informa\xE7\xF5es sobre o alvo (idade, profiss\xE3o...) ou j\xE1 o viu pessoalmente: +5Voc\xEA conhece bem o alvo: -0Voc\xEA tem um pertence pessoal ou roupa do alvo: -5Voc\xEA tem uma parte do corpo do alvo(unhas, cabelos...): -10"
    }, {
        name: "V\xEDnculo de Sangue",
        circle: "4",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 ser",
        duration: "cena",
        save: "Fortitude anula",
        description: "Voc\xEA manifesta um s\xEDmbolo de Sangue no seu corpo e no corpo do alvo. Sempre que voc\xEA sofrer dano, o alvo deve fazer um teste de Fortitude. Se ele falhar, voc\xEA sofre apenas metade do dano e ele sofre a metade restante.Voc\xEA pode conjurar o ritual com efeito inverso, fazendo com que voc\xEA receba metade de todo o dano que o alvo receberia. Alvos volunt\xE1rios n\xE3o precisam fazer testes de resist\xEAncia."
    }, {
        name: "Vomitar Pestes",
        circle: "3",
        element: "Sangue",
        execution: "padr\xE3o",
        range: "m\xE9dio",
        effect: "1 enxame Grande (quadrado de 3m)",
        duration: "sustentada",
        save: "Reflexos reduz \xE0 metade",
        normalDice: "5d12",
        description: "Voc\xEA vomita um enxame de pequenas criaturas de Sangue, que surge em um ponto adjacente a sua escolha. O enxame pode passar pelo espa\xE7o de outros seres e n\xE3o impede que outros seres entrem no espa\xE7o dele. No final de cada um de seus turnos, o enxame causa 5d12 pontos de dano de sangue a qualquer ser no espa\xE7o dele (Reflexos reduz \xE0 metade). Voc\xEA pode gastar uma a\xE7\xE3o de movimento para mover o enxame com deslocamento de 12m.\n\nDiscente (+2 PE): al\xE9m do normal, um alvo que falhe no teste de Reflexos fica agarrada (o enxame escala e cobre o corpo dele). O alvo pode gastar uma a\xE7\xE3o padr\xE3o e fazer um teste de Acrobacia ou Atletismo para escapar. Se voc\xEA mover o enxame, o alvo fica livre.\n\nVerdadeiro (+5 PE): o enxame vira Enorme (cubo de 6m de lado) e ganha deslocamento de voo 18m."
    }, {
        name: "Zerar Entropia",
        circle: "3",
        element: "Morte",
        execution: "padr\xE3o",
        range: "curto",
        target: "1 pessoa",
        duration: "cena",
        save: "Vontade parcial",
        description: 'Voc\xEA zera completamente a entropia do alvo em rela\xE7\xE3o ao ambiente, deixando-o paralisado. Se passar na resist\xEAncia, em vez disso fica lento. No in\xEDcio de cada um de seus turnos, o alvo pode gastar uma a\xE7\xE3o completa para fazer um novo teste de Vontade. Se passar, encerra o efeito.\n\nDiscente (+4 PE): muda o alvo para "1 ser". Requer 4\xBA c\xEDrculo.\n\nVerdadeiro (+11 PE): muda o alvo para "seres escolhidos". Requer 4\xBA c\xEDrculo.'
    }]
//  endregion

// region Itens/Armas
const municoes = [
    {
    name: "Balas Curtas",
    category: "0",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Muni\xE7\xE3o b\xE1sica, usada em pistolas, rev\xF3lveres e submetralhadoras. Um pacote de balas curtas dura duas cenas."
}, {
    name: "Balas Longas",
    category: "I",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Maior e mais potente, esta muni\xE7\xE3o \xE9 usada em fuzis e metralhadoras. Um pacote de balas longas dura uma cena."
}, {
    name: "Cartuchos",
    category: "I",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Usados em espingardas, esses cartuchos s\xE3o carregados com esferas de chumbo. Um pacote de cartuchos dura uma cena."
}, {
    name: "Combust\xEDvel",
    category: "I",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Um tanque de combust\xEDvel para lan\xE7a-chamas. Dura uma cena."
}, {
    name: "Flechas",
    category: "0",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Usadas em arcos e bestas, flechas podem ser reaproveitadas ap\xF3s cada combate. Por isso, um pacote de flechas dura uma miss\xE3o inteira."
}, {
    name: "Foguete",
    category: "I",
    slots: 1,
    tag: "Muni\xE7\xF5es",
    itemType: "ammunition",
    description: "Disparado por bazucas. Ao contr\xE1rio de outras muni\xE7\xF5es, cada foguete dura um \xFAnico disparo, n\xE3o uma cena. Para fazer v\xE1rios ataques, voc\xEA precisar\xE1 carregar v\xE1rios foguetes."
}]

const armas = [
{
    name: "Customizado",
}, {
    name: "Coronhada",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d4",
    secondaryDamage: "1d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "-",
    slots: 0,
    itemType: "weapon",
    description: "Voc\xEA pode usar uma arma de fogo como uma arma corpo a corpo. O dano \xE9 1d4 para armas de fogo leves e de uma m\xE3o (como pistolas) e 1d6 para armas de fogo de duas m\xE3os (como fuzis)."
}, {
    name: "Faca",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d4",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Corte",
    range: "Curto",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Uma l\xE2mina longa e afiada, como uma navalha, uma faca de churrasco ou uma faca militar (facas de cozinha pequenas causam apenas 1d3 pontos de dano). \xC9 uma arma \xE1gil e pode ser arremessada.",
    image: "https://fichasop.com/assets/img/Armas/faca_militar.png",
}, {
    name: "Martelo",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Esta ferramenta comum pode ser usada como arma na falta de op\xE7\xF5es melhores."
}, {
    name: "Punhal",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d4",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Perfura\xE7\xE3o",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Uma faca de l\xE2mina longa e pontiaguda, usada por cultistas em seus rituais. \xC9 uma arma \xE1gil."
}, {
    name: "Bast\xE3o",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d6",
    secondaryDamage: "1d8",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Um cilindro de madeira maci\xE7a. Pode ser um taco de beisebol, um cacetete da pol\xEDcia, uma tonfa ou apenas uma clava envolta em pregos ou arame farpado. Voc\xEA pode empunhar um bast\xE3o com uma m\xE3o (dano 1d6) ou com as duas (dano 1d8)."
}, {
    name: "Machete",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d6",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Corte",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Uma l\xE2mina longa, muito usada como ferramenta para abrir trilhas."
}, {
    name: "Lan\xE7a",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Perfura\xE7\xE3o",
    range: "Curto",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Uma haste de madeira com uma ponta met\xE1lica afiada, a lan\xE7a \xE9 uma arma arcaica, mas usada ainda hoje por artistas marciais. Pode ser arremessada."
}, {
    name: "Cajado",
    proficiencie: "Armas Simples",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "1d6",
    secondaryDamage: "1d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "0",
    slots: 2,
    itemType: "weapon",
    description: "Um cabo de madeira ou barra de ferro longo. Inclui cajado o bo usado em artes marciais. \xC9 uma arma \xE1gil. Al\xE9m disso, pode ser usado com Combater com Duas Armas (e poderes similares) para fazer ataques adicionais, como se fosse uma arma de uma m\xE3o e uma arma leve."
}, {
    name: "Arco",
    proficiencie: "Armas Simples",
    type: "Arma de Disparo",
    handling: "Duas M\xE3os",
    damage: "1d6",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Perfura\xE7\xE3o",
    range: "M\xE9dio",
    category: "0",
    slots: 2,
    ammunitionName: municoes[4].name,
    itemType: "weapon",
    description: "Um arco e flecha comum, pr\xF3prio para tiro ao alvo."
}, {
    name: "Besta",
    proficiencie: "Armas Simples",
    type: "Arma de Disparo",
    handling: "Duas M\xE3os",
    damage: "1d8",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Perfura\xE7\xE3o",
    range: "M\xE9dio",
    category: "0",
    slots: 2,
    ammunitionName: municoes[4].name,
    itemType: "weapon",
    description: "Esta arma da antiguidade exige uma a\xE7\xE3o de movimento para ser recarregada a cada disparo."
}, {
    name: "Pistola",
    proficiencie: "Armas Simples",
    type: "Arma de Fogo",
    handling: "Leve",
    damage: "1d12",
    criticalMult: 2,
    criticalRange: 18,
    damageType: "Bal\xEDstico",
    range: "Curto",
    category: "I",
    slots: 1,
    ammunitionName: municoes[0].name,
    itemType: "weapon",
    description: "Uma arma de m\xE3o comum entre policiais e militares por ser facilmente recarreg\xE1vel.",
    image: "https://fichasop.com/assets/img/Armas/pistola.png",
}, {
    name: "Rev\xF3lver",
    proficiencie: "Armas Simples",
    type: "Arma de Fogo",
    handling: "Leve",
    damage: "2d6",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "Curto",
    category: "I",
    slots: 1,
    ammunitionName: municoes[0].name,
    itemType: "weapon",
    description: "A arma de fogo mais comum, e uma das mais confi\xE1veis.",
    image: "https://fichasop.com/assets/img/Armas/revolver.png",
}, {
    name: "Fuzil de Ca\xE7a",
    proficiencie: "Armas Simples",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "2d8",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "M\xE9dio",
    category: "I",
    slots: 2,
    ammunitionName: municoes[1].name,
    itemType: "weapon",
    description: "Esta arma de fogo \xE9 bastante popular entre fazendeiros, ca\xE7adores e atiradores esportistas."
}, {
    name: "Machadinha",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d6",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Corte",
    range: "Curto",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Ferramenta \xFAtil para cortar madeira, pode ser facilmente encontrada em canteiros de obras e fazendas. Pode ser arremessada."
}, {
    name: "Nunchaku",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Leve",
    damage: "1d8",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Dois bast\xF5es curtos de madeira ligados por uma corrente. \xC9 uma arma \xE1gil."
}, {
    name: "Corrente",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d8",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "0",
    slots: 1,
    itemType: "weapon",
    description: "Um peda\xE7o de corrente grossa pode ser usado como uma arma bastante efetiva. A corrente fornece +2 em testes para desarmar e derrubar."
}, {
    name: "Espada",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d8",
    secondaryDamage: "1d10",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 1,
    itemType: "weapon",
    description: "Uma arma medieval, como uma espada longa dos cavaleiros europeus ou uma cimitarra sarracena. Voc\xEA pode empunhar uma espada com uma m\xE3o (dano 1d8) ou com as duas (dano 1d10).",
    image: "https://fichasop.com/assets/img/Armas/montante.png",
}, {
    name: "Florete",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d6",
    criticalMult: 2,
    criticalRange: 18,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 1,
    itemType: "weapon",
    description: "Esta espada de l\xE2mina fina e comprida \xE9 usada por esgrimistas.\xC9 uma arma \xE1gil."
}, {
    name: "Machado",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "1d8",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 1,
    itemType: "weapon",
    description: "Uma ferramenta importante para lenhadores e bombeiros, um machado pode causar ferimentos terr\xEDveis."
}, {
    name: "Ma\xE7a",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Uma M\xE3o",
    damage: "2d4",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "I",
    slots: 1,
    itemType: "weapon",
    description: "Bast\xE3o com uma cabe\xE7a met\xE1lica cheia de protuber\xE2ncias."
}, {
    name: "Acha",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "1d12",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Um machado grande e pesado, usado no corte de \xE1rvores largas."
}, {
    name: "Gadanho",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "2d4",
    criticalMult: 4,
    criticalRange: 20,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Uma ferramenta agr\xEDcola, o gadanho \xE9 uma vers\xE3o maior da foice, para uso com as duas m\xE3os. Foi criada para ceifar cereais, mas tamb\xE9m pode ceifar vidas."
}, {
    name: "Katana",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "1d10",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Origin\xE1ria do Jap\xE3o, esta espada longa e levemente curvada transcendeu os s\xE9culos. \xC9 uma arma \xE1gil. Se voc\xEA for veterano em Luta pode us\xE1-la como uma arma de uma m\xE3o."
}, {
    name: "Marreta",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "3d4",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Normalmente usada para demolir paredes, tamb\xE9m pode ser usada para demolir pessoas. Use estas estat\xEDsticas para outras ferramentas de constru\xE7\xE3o civil, como picaretas."
}, {
    name: "Montante",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "2d6",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Enorme e pesada, esta espada de 1,5m de comprimento foi uma das armas mais poderosas em seu tempo.",
    image: "https://fichasop.com/assets/img/Armas/montante.png",
}, {
    name: "Motosserra",
    proficiencie: "Armas T\xE1ticas",
    type: "Corpo a Corpo",
    handling: "Duas M\xE3os",
    damage: "3d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Corte",
    range: "-",
    category: "I",
    slots: 2,
    itemType: "weapon",
    description: "Uma ferramenta motorizada capaz de causar ferimentos profundos; sempre que rolar um 6 em um dado de dano com uma motosserra, role um dado de dano adicional. Apesar de potente, esta arma \xE9 muito desajeitada e imp\xF5e uma penalidade de -1d20 nos seus testes de ataque. Ligar uma motosserra gasta uma a\xE7\xE3o de movimento."
}, {
    name: "Arco Composto",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Disparo",
    handling: "Duas M\xE3os",
    damage: "1d10",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Perfura\xE7\xE3o",
    range: "M\xE9dio",
    category: "I",
    slots: 2,
    ammunitionName: municoes[4].name,
    itemType: "weapon",
    description: "Este arco moderno usa materiais de alta tens\xE3o e um sistema de roldanas para gerar mais press\xE3o. Ao contr\xE1rio de outras armas de disparo, permite que voc\xEA aplique seu valor de For\xE7a \xE0s rolagens de dano."
}, {
    name: "Balestra",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Disparo",
    handling: "Duas M\xE3os",
    damage: "1d12",
    criticalMult: 2,
    criticalRange: 19,
    damageType: "Perfura\xE7\xE3o",
    range: "M\xE9dio",
    category: "I",
    slots: 2,
    ammunitionName: municoes[4].name,
    itemType: "weapon",
    description: "Uma besta pesada, capaz de disparos poderosos. Exige uma a\xE7\xE3o de movimento para ser recarregada a cada disparo."
}, {
    name: "Submetralhadora",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Fogo",
    handling: "Uma M\xE3o",
    damage: "2d6",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "Curto",
    category: "I",
    slots: 1,
    ammunitionName: municoes[0].name,
    itemType: "weapon",
    description: "Esta arma de fogo autom\xE1tica pode ser empunhada com apenas uma m\xE3o."
}, {
    name: "Espingarda",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "4d6",
    criticalMult: 3,
    criticalRange: 20,
    damageType: "Bal\xEDstico",
    range: "Curto",
    category: "I",
    slots: 2,
    ammunitionName: municoes[2].name,
    itemType: "weapon",
    description: "Arma de fogo longa e com cano liso. A espingarda causa apenas metade do dano em alcance m\xE9dio ou maior.",
    image: "https://fichasop.com/assets/img/Armas/espingarda.png",
}, {
    name: "Fuzil de Assalto",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "2d10",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "M\xE9dio",
    category: "II",
    slots: 2,
    ammunitionName: municoes[1].name,
    itemType: "weapon",
    description: "A arma de fogo padr\xE3o da maioria dos ex\xE9rcitos modernos. \xC9 uma arma autom\xE1tica.",
    image: "https://fichasop.com/assets/img/Armas/revolver.png",
}, {
    name: "Fuzil de Precis\xE3o",
    proficiencie: "Armas T\xE1ticas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "2d10",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "Longo",
    category: "III",
    slots: 2,
    ammunitionName: municoes[1].name,
    itemType: "weapon",
    description: "Esta arma de fogo de uso militar \xE9 projetada para disparos longos e precisos. Se for veterano em Pontaria e mirar com um fuzil de precis\xE3o, voc\xEA recebe +5 na margem de amea\xE7a de seu ataque.",
    image: "https://fichasop.com/assets/img/Armas/fuzil_precisao.png",
}, {
    name: "Bazuca",
    proficiencie: "Armas Pesadas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "10d8",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Impacto",
    range: "M\xE9dio",
    category: "III",
    slots: 2,
    ammunitionName: municoes[5].name,
    itemType: "weapon",
    description: "Este lan\xE7a-foguetes foi concebido como uma arma anti-tanques, mas tamb\xE9m se mostrou eficaz contra criaturas. A bazuca causa seu dano no alvo atingido e em todos os seres num raio de 3m; esses seres (mas n\xE3o o alvo atingido diretamente) t\xEAm direito a um teste de Reflexos (DT Agi) para reduzir o dano \xE0 metade. Voc\xEA pode disparar o foguete num ponto qualquer em alcance m\xE9dio, em vez de num ser espec\xEDfico; nesse caso, n\xE3o precisa rolar ataque e n\xE3o tem chance de errar (mas tamb\xE9m n\xE3o acerta nenhum ser diretamente). A bazuca exige uma a\xE7\xE3o de movimento para ser recarregada a cada disparo."
}, {
    name: "Lan\xE7a-chamas",
    proficiencie: "Armas Pesadas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "6d6",
    criticalMult: 2,
    criticalRange: 20,
    damageType: "Fogo",
    range: "Curto",
    category: "III",
    slots: 2,
    ammunitionName: municoes[3].name,
    itemType: "weapon",
    description: "Equipamento militar que esguicha l\xEDquido inflam\xE1vel incandescente. Um lan\xE7a-chamas atinge todos os seres em uma linha de 1,5m de largura com alcance curto, mas n\xE3o alcan\xE7a al\xE9m disso. Fa\xE7a um \xFAnico teste de ataque e compare o resultado com a Defesa de todos os seres na \xE1rea. Al\xE9m de sofrer dano, seres atingidos ficam em chamas."
}, {
    name: "Metralhadora",
    proficiencie: "Armas Pesadas",
    type: "Arma de Fogo",
    handling: "Duas M\xE3os",
    damage: "2d12",
    criticalMult: 3,
    criticalRange: 19,
    damageType: "Bal\xEDstico",
    range: "M\xE9dio",
    category: "II",
    slots: 2,
    ammunitionName: municoes[1].name,
    itemType: "weapon",
    description: "Uma arma de fogo pesada, de uso militar. Para atacar com uma metralhadora, voc\xEA precisa ter For\xE7a 4 ou maior ou gastar uma a\xE7\xE3o de movimento para apoi\xE1-la em seu trip\xE9 ou suporte apropriado; caso contr\xE1rio, sofre \u20135 em seus ataques. Uma metralhadora \xE9 uma arma autom\xE1tica."
}]

const protecoes = [
    {
    name: "Prote\xE7\xE3o Leve",
    defense: 5,
    category: "I",
    slots: 2,
    itemType: "protection",
    description: "Jaqueta de couro pesada ou um colete de kevlar. Essa prote\xE7\xE3o \xE9 tipicamente usada por seguran\xE7as e policiais."
}, {
    name: "Prote\xE7\xE3o Pesada",
    defense: 10,
    category: "II",
    slots: 5,
    itemType: "protection",
    description: "Equipamento usado por for\xE7as especiais da pol\xEDcia e pelo ex\xE9rcito. Consiste de capacete, ombreiras, joelheiras e caneleiras, al\xE9m de um colete com v\xE1rias camadas de kevlar. Fornece resist\xEAncia a bal\xEDstico, corte, impacto e perfura\xE7\xE3o 2. No entanto, por ser desconfort\xE1vel e volumosa, imp\xF5e \u20135 em testes de per\xEDcias que sofrem penalidade de carga."
}, {
    name: "Escudo",
    defense: 2,
    category: "I",
    slots: 2,
    itemType: "protection",
    description: "Um escudo medieval ou moderno, como aqueles usados por tropas de choque. Para efeitos de profici\xEAncia, conta como prote\xE7\xE3o pesada. Precisa ser empunhado em uma m\xE3o e fornece Defesa +2."
}]

const outros = [
    {
    name: "Customizado",
}, {
    name: "Kit de Per\xEDcia",
    tag: "Acess\xF3rios",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Um conjunto de ferramentas necess\xE1rias para algumas per\xEDcias ou usos de per\xEDcias. Sem o kit, voc\xEA sofre \u20135 no teste. Existe um kit de per\xEDcia para cada per\xEDcia que exige este item."
}, {
    name: "Utens\xEDlio",
    tag: "Acess\xF3rios",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Um item comum que tenha uma utilidade espec\xEDfica, como um canivete, uma lupa, um smartphone ou um notebook. Um utens\xEDlio concede +2 em um teste de uma per\xEDcia a sua escolha (exceto Luta e Pontaria), definida quando o item \xE9 adquirido. Por exemplo, um smartphone pode ser usado para acessar a internet e fornecer b\xF4nus em Ci\xEAncias, enquanto um notebook pode ser preparado para invadir sistemas e fornecer b\xF4nus em Tecnologia. Voc\xEA pode inventar itens menos realistas, como um \u201Cdetector de mentiras port\xE1til\u201D que fornece +2 em Intui\xE7\xE3o, mas o mestre tem a palavra final se o utens\xEDlio \xE9 apropriado ou n\xE3o. Utens\xEDlios sempre ocupam 1 espa\xE7o e precisam ser empunhados para que o b\xF4nus seja aplicado."
}, {
    name: "Vestimenta",
    tag: "Acess\xF3rios",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Uma pe\xE7a de vestu\xE1rio que fornece um b\xF4nus em uma per\xEDcia espec\xEDfica (exceto Luta ou Pontaria). Por exemplo, um par de botas militares pode fornecer +2 em Atletismo, enquanto um terno ou vestido elegante pode fornecer +2 em Diplomacia. Assim como utens\xEDlios, o benef\xEDcio de cada vestimenta deve ser aprovado pelo mestre. Voc\xEA pode receber os b\xF4nus de no m\xE1ximo duas vestimentas ao mesmo tempo. Vestir ou despir uma vestimenta \xE9 uma a\xE7\xE3o completa."
}, {
    name: "Granada de Atordoamento",
    tag: "Explosivos",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Para usar uma granada, voc\xEA precisa empunh\xE1-la e ent\xE3o gastar uma a\xE7\xE3o padr\xE3o para arremess\xE1-la em um ponto \xE0 sua escolha em alcance m\xE9dio. A granada afeta um raio de 6m a partir do ponto de impacto. O efeito que ela causa varia conforme o tipo de granada.Tamb\xE9m chamadas de flash-bang, por criarem um estouro barulhento e luminoso. Seres na \xE1rea ficam atordoados por 1 rodada (Fortitude DT Agi reduz para ofuscado e surdo por uma rodada)."
}, {
    name: "Granada de Fragmenta\xE7\xE3o",
    tag: "Explosivos",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Para usar uma granada, voc\xEA precisa empunh\xE1-la e ent\xE3o gastar uma a\xE7\xE3o padr\xE3o para arremess\xE1-la em um ponto \xE0 sua escolha em alcance m\xE9dio. A granada afeta um raio de 6m a partir do ponto de impacto. O efeito que ela causa varia conforme o tipo de granada.Espalha fragmentos perfurantes. Seres na \xE1rea sofrem 8d6 pontos de dano de perfura\xE7\xE3o (Reflexos DT Agi reduz \xE0 metade)."
}, {
    name: "Granada de Fuma\xE7a",
    tag: "Explosivos",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Para usar uma granada, voc\xEA precisa empunh\xE1-la e ent\xE3o gastar uma a\xE7\xE3o padr\xE3o para arremess\xE1-la em um ponto \xE0 sua escolha em alcance m\xE9dio. A granada afeta um raio de 6m a partir do ponto de impacto. O efeito que ela causa varia conforme o tipo de granada.Produz uma fuma\xE7a espessa e escura. Seres na \xE1rea ficam cegos e sob camuflagem total. A fuma\xE7a dura 2 rodadas."
}, {
    name: "Granada Incendi\xE1ria",
    tag: "Explosivos",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Para usar uma granada, voc\xEA precisa empunh\xE1-la e ent\xE3o gastar uma a\xE7\xE3o padr\xE3o para arremess\xE1-la em um ponto \xE0 sua escolha em alcance m\xE9dio. A granada afeta um raio de 6m a partir do ponto de impacto. O efeito que ela causa varia conforme o tipo de granada.Espalha labaredas incandescentes. Seres na \xE1rea sofrem 6d6 pontos de dano de fogo e ficam em chamas (Reflexos DT Agi reduz o dano \xE0 metade e evita a condi\xE7\xE3o em chamas)."
}, {
    name: "Mina Antipessoal",
    tag: "Explosivos",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Esta mina \xE9 ativada por controle remoto. Se voc\xEA estiver a at\xE9 alcance longo dela, pode gastar uma a\xE7\xE3o padr\xE3o para deton\xE1-la. Ao explodir, a mina dispara centenas de bolas de a\xE7o em um cone de 6m, causando 12d6 pontos de dano de perfura\xE7\xE3o em todos os seres na \xE1rea (Reflexos DT Int reduz \xE0 metade). Voc\xEA define a dire\xE7\xE3o do cone quando posiciona a mina no ch\xE3o. Instalar a mina exige uma a\xE7\xE3o completa e um teste de T\xE1tica contra DT 15. Caso falhe, voc\xEA gasta a mina, mas ela n\xE3o funciona. Encontrar uma mina instalada exige um teste de Percep\xE7\xE3o (DT igual ao resultado do seu teste para instal\xE1-la)."
}, {
    name: "Algemas",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Algemas. Um par de algemas de a\xE7o. Para prender uma pessoa que n\xE3o esteja indefesa voc\xEA precisa empunhar a algema, agarrar a pessoa e ent\xE3o vencer um novo teste de agarrar contra ela. Voc\xEA pode prender os dois pulsos da pessoa (\u20135 em testes que exijam o uso das m\xE3os, impede conjura\xE7\xE3o) ou um dos pulsos dela em um objeto im\xF3vel adjacente, caso haja, para impedir que ela se mova. Escapar das algemas exige um teste de Acrobacia contra DT 30 (ou ter as chaves...)."
}, {
    name: "Arp\xE9u",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Um gancho de a\xE7o amarrado na ponta de uma corda para se fixar em muros, janelas, parapeitos de pr\xE9dios... Prender um arp\xE9u exige um teste de Pontaria (DT 15). Subir um muro com a ajuda de uma corda fornece +5 no teste de Atletismo."
}, {
    name: "Bandoleira",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Um cinto com bolsos e al\xE7as. Uma vez por rodada, voc\xEA pode sacar ou guardar um item em seu invent\xE1rio como uma a\xE7\xE3o livre."
}, {
    name: "Bin\xF3culos",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Estes bin\xF3culos militares fornecem +5 em testes de Percep\xE7\xE3o para observar coisas distantes."
}, {
    name: "Bloqueador de Sinal",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Este dispositivo compacto emite ondas que \u201Cpoluem\u201D a frequ\xEAncia de r\xE1dio usada por celulares, impedindo que qualquer aparelho desse tipo em alcance m\xE9dio se conecte."
}, {
    name: "Cicatrizante",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Um spray contendo um rem\xE9dio com potente efeito cicatrizante. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e este item para curar 2d8+2 PV em voc\xEA ou em um ser adjacente."
}, {
    name: "Corda",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Um rolo com 10 metros de corda resistente. Possui diversas utilidades: pode ajudar a descer um buraco ou pr\xE9dio (+5 em testes de Atletismo nessas situa\xE7\xF5es), amarrar pessoas inconscientes etc."
}, {
    name: "Equipamento de Sobreviv\xEAncia",
    tag: "Itens Operacionais",
    category: "0",
    slots: 2,
    itemType: "misc",
    description: "Uma mochila com saco de dormir, panelas, GPS e outros itens \xFAteis para sobreviver no mato. Fornece +5 em testes de Sobreviv\xEAncia para acampar e orientar-se e permite que voc\xEA fa\xE7a esses testes sem treinamento."
}, {
    name: "Lanterna T\xE1tica",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Ilumina lugares escuros. Al\xE9m disso, voc\xEA pode gastar uma a\xE7\xE3o de movimento para mirar a luz nos olhos de um ser em alcance curto. Ele fica ofuscado por 1 rodada, mas imune \xE0 lanterna pelo resto da cena."
}, {
    name: "M\xE1scara de G\xE1s",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Uma m\xE1scara com filtro que cobre o rosto inteiro. Fornece +10 em testes de Fortitude contra efeitos que dependam de respira\xE7\xE3o."
}, {
    name: "Mochila Militar",
    tag: "Itens Operacionais",
    category: "I",
    slots: -2,
    itemType: "misc",
    description: "Uma mochila leve e de alta qualidade. Ela n\xE3o usa nenhum espa\xE7o e aumenta sua capacidade de carga em 2 espa\xE7os."
}, {
    name: "\xD3culos de Vis\xE3o T\xE9rmica",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Estes \xF3culos eliminam a penalidade em testes por camuflagem."
}, {
    name: "P\xE9 de Cabra",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Esta barra de ferro fornece +5 em testes de For\xE7a para arrombar portas. Pode ser usada em combate como um bast\xE3o."
}, {
    name: "Pistola de Dardos",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Esta arma dispara dardos com um poderoso son\xEDfero. Para disparar em um ser, fa\xE7a um ataque \xE0 dist\xE2ncia contra ele. Se acert\xE1-lo, ele fica inconsciente at\xE9 o fim da cena (Fortitude DT Agi reduz para desprevenida e lenta por uma rodada). A pistola vem com 2 dardos. Uma caixa adicional com 2 dardos \xE9 um item de categoria 0 que ocupa 1 espa\xE7o."
}, {
    name: "Pistola Sinalizadora",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Esta pistola dispara um sinalizador luminoso, \xFAtil para chamar outras pessoas para sua localiza\xE7\xE3o. Pode ser usada uma vez como uma arma de disparo leve com alcance curto que causa 2d6 pontos de dano de fogo. A pistola vem com 2 cargas. Uma caixa adicional com 2 cargas \xE9 um item de categoria 0 que ocupa 1 espa\xE7o."
}, {
    name: "Soqueira",
    tag: "Itens Operacionais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Esta pe\xE7a de metal e usada entre os dedos e permite socos mais perigosos \u2014 fornece +1 em rolagens de dano desarmado. Uma soqueira pode receber modifica\xE7\xF5es e maldi\xE7\xF5es de armas corpo a corpo e aplica os efeitos delas em seus ataques desarmados."
}, {
    name: "Spray de Pimenta",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Este spray dispara um composto qu\xEDmico que causa dor e lacrimejo. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para atingir um ser adjacente. O ser fica cego por 1d4 rodadas (Fortitude DT Agi evita). A carga do spray dura dois usos."
}, {
    name: "Taser",
    tag: "Itens Operacionais",
    category: "I",
    slots: 1,
    itemType: "misc",
    description: "Um dispositivo de eletrochoque capaz de atordoar ou at\xE9 incapacitar um alvo. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para atingir um ser adjacente. O alvo sofre 1d6 pontos de dano de eletricidade e fica atordoado por uma rodada (Fortitude DT Agi evita). A bateria do taser dura dois usos."
}, {
    name: "Traje Hazmat",
    tag: "Itens Operacionais",
    category: "I",
    slots: 2,
    itemType: "misc",
    description: "Uma roupa imperme\xE1vel e que cobre o corpo inteiro, usada para impedir o contato do usu\xE1rio com materiais t\xF3xicos. Fornece +5 em testes de resist\xEAncia contra efeitos ambientais e resist\xEAncia a qu\xEDmico 10."
}, {
    name: "Amarras de (Elemento)",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Cordas ou correntes feitas de um elemento Paranormal espec\xEDfico. As amarras s\xE3o preparadas para imobilizar criaturas do Outro Lado que sejam vulner\xE1veis ao elemento que as comp\xF5em e podem ser usadas de duas formas.\nArmadilha. Voc\xEA gasta as amarras, uma a\xE7\xE3o completa e 2 PE e prepara uma armadilha de 3x3m. Uma criatura que atravesse o espa\xE7o pela primeira vez em seu turno precisa fazer um teste de de Reflexos (DT Int); se falhar, fica im\xF3vel at\xE9 o final da cena. Mesmo se passar, considera o espa\xE7o ocupado pela armadilha como terreno dif\xEDcil.\nLa\xE7ar. Voc\xEA gasta uma a\xE7\xE3o padr\xE3o e 1 PE e escolhe uma criatura em alcance curto. Se falhar num teste de Vontade (DT Agi), a criatura fica paralisada at\xE9 o in\xEDcio de seu pr\xF3ximo turno, quando pode repetir o teste. Manter a criatura enla\xE7ada requer o gasto de 1 PE por rodada."
}, {
    name: "C\xE2mera de Aura Paranormal",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Esta c\xE2mera amaldi\xE7oada com Energia possui sigilos de Conhecimento para capturar auras paranormais. Tirar uma foto gasta uma a\xE7\xE3o padr\xE3o e 1 PE. As fotos s\xE3o instant\xE2neas e revelam a presen\xE7a de auras paranormais em pessoas e objetos. As auras s\xE3o da cor associada ao elemento."
}, {
    name: "Componentes Ritual\xEDsticos de (Elemento)",
    tag: "Itens Paranormais",
    category: "0",
    slots: 1,
    itemType: "misc",
    description: "Um conjunto de objetos utilizados em rituais de um elemento entre Sangue, Morte, Conhecimento ou Energia (n\xE3o existem componentes ritual\xEDsticos de Medo). Componentes ritual\xEDsticos s\xE3o necess\xE1rios para a conjura\xE7\xE3o de rituais do elemento em quest\xE3o.\nEnergia: eletricidade, dispositivos tecnol\xF3gicos (celulares, computadores etc.), circuitos eletr\xF4nicos, fontes de calor e luz, pilhas, baterias, cabos de cobre e prata, p\xF3lvora, moedas, dados, \xEDm\xE3s...\nSangue: \xF3rg\xE3os, carne, sangue, animais vivos (para sacrif\xEDcio), navalhas, agulhas, arame farpado, correntes, metal enferrujado, flu\xEDdos corporais...\nMorte: ossos, dentes, cinzas, fios de cabelo, cristais pretos, rel\xF3gios, galhos secos, folhas secas, plantas mortas, ra\xEDzes, areia, poeira, Lodo...\nConhecimento: escrituras, pap\xE9is, livros, pergaminhos, pedras preciosas, ouro, cordas, tecido, cristais brancos, vidro, m\xE1scaras, instrumentos de escrita (l\xE1pis, caneta, tinta, giz etc.)..."
}, {
    name: "Emissor de Pulsos Paranormais",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Esta pequena caixa coberta de sigilos foi desenvolvida para servir como uma \u201Cisca\u201D de criaturas paranormais. Ativar a caixa gasta uma a\xE7\xE3o completa e 1 PE. A caixa emite um pulso de um elemento definido pelo ativador, que atrai criaturas do mesmo elemento e afasta criaturas do elemento oposto. As criaturas afetadas t\xEAm direito a um teste de Vontade (DT Pre) para evitar o efeito."
}, {
    name: "Escuta de Ru\xEDdos Paranormais",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Este microfone funciona como um aparato espi\xE3o, com a diferen\xE7a que consegue captar ru\xEDdos paranormais. Ativar a escuta gasta uma a\xE7\xE3o completa e 2 PE e faz com que ela grave ru\xEDdos por at\xE9 24 horas. Ouvir a escuta fornece +5 em testes de Ocultismo para identificar criatura."
}, {
    name: "Medidor de Estabilidade da Membrana",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Um dispositivo complexo, composto por diversos medidores \u2014 de temperatura, campo magn\xE9tico, dilata\xE7\xE3o temporal... Um agente treinado em Ocultismo pode usar o medidor para avaliar o estado da Membrana em uma \xE1rea, o que indica a chance de uma entidade se manifestar nela. Um ambiente com valores racionais e constantes ao longo de algumas horas dificilmente originar\xE1 uma criatura ou manifesta\xE7\xE3o perigosa. Por\xE9m, se as leituras apresentarem dados inexplic\xE1veis ou com grandes varia\xE7\xF5es, o lugar poder\xE1 conter uma entidade. Apesar de ser um bom indicativo, o medidor n\xE3o fornece respostas definitivas, j\xE1 que um ambiente com a Membrana danificada ainda pode n\xE3o ter sido afetado por manifesta\xE7\xF5es, assim como um lugar com a Membrana protegida por conter uma criatura poderosa vinda de outro lugar."
}, {
    name: "Scanner de Manifesta\xE7\xE3o Paranormal de (Elemento)",
    tag: "Itens Paranormais",
    category: "II",
    slots: 1,
    itemType: "misc",
    description: "Este item \xE9 composto por um dispositivo conectado a pequenos objetos amaldi\xE7oados de uma entidade espec\xEDfica e adornado com uma s\xE9rie de sigilos. Ativar o scanner \xE9 uma a\xE7\xE3o padr\xE3o. Quando ativado, o scanner consome 1 PE por rodada do usu\xE1rio, que sempre sabe a dire\xE7\xE3o de todas as manifesta\xE7\xF5es paranormais ativas (rituais, criaturas, itens amaldi\xE7oados etc.) do elemento escolhido em alcance longo. Se o elemento principal de uma criatura for outro, mas ela tiver como complemento o elemento escolhido do scanner, tamb\xE9m ser\xE1 detectada."
}]

const itensAmaldicoados = [
    {
    name: "Cora\xE7\xE3o Pulsante",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um cora\xE7\xE3o humano banhado em sangue, pulsando como se ainda estivesse dentro de um corpo. Se estiver empunhando o cora\xE7\xE3o pulsante e sofrer dano, voc\xEA pode gastar uma rea\xE7\xE3o para espremer o item e reduzir esse dano pela metade. Sempre que usa o cora\xE7\xE3o, voc\xEA deve fazer um teste de Fortitude (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, o item \xE9 destru\xEDdo. Como o cora\xE7\xE3o continua pulsando incessantemente com Sangue, qualquer compartimento em que estiver deve ser drenado uma vez por dia, caso contr\xE1rio o Sangue poder\xE1 escorrer e danificar outros objetos com os quais entrar em contato."
}, {
    name: "Coroa de Espinhos",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma coroa, colar ou pulseira feita de um material que lembra os espinhos de uma roseira banhados em sangue. Uma vez por rodada, voc\xEA pode usar uma rea\xE7\xE3o para transformar qualquer dano mental que fosse sofrer em dano de Sangue, mas n\xE3o consegue mais recuperar sanidade por descanso enquanto estiver vestindo o item. \xC9 preciso vestir o item por uma semana para ativar seus efeitos."
}, {
    name: "Faixas da Vid\xEAncia",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma faixa de tecido, geralmente preto, com pequenos s\xEDmbolos de Morte gravados em suas bordas. O usu\xE1rio \xE9 considerado cego para alvos al\xE9m do alcance m\xE9dio. No entanto, a faixa distorce a percep\xE7\xE3o temporal do usu\xE1rio dentro do alcance, fazendo com que enxergue os eventos fora da linha do tempo. Contra efeitos em alcance m\xE9dio, o usu\xE1rio nunca fica desprevinido, recebe +10 em testes de resist\xEAncia e recebe +10 na Defesa quando esquiva. Al\xE9m disso, uma vez por cena de investiga\xE7\xE3o, pode gastar 2 PE para ter um vislumbre do passado que auxilia a a\xE7\xE3o de procurar pistas, fornecendo +5 para o teste."
}, {
    name: "Frasco de Vitalidade",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Este pequeno recipiente de vidro possui uma tampa de metal gravada com um selo de Sangue. Voc\xEA pode gastar 1 minuto e sofrer at\xE9 20 pontos de dano para encher o frasco com seu pr\xF3prio sangue. Enquanto estiver no recipiente, seu sangue se mant\xE9m fresco. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para beber o conte\xFAdo do frasco e recuperar a mesma quantidade de PV que armazenou nele, mas deve passar em um teste de Fortitude (DT 20) para n\xE3o ficar enjoado por uma rodada."
}, {
    name: "P\xE9rola de Sangue",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma esfera de aproximadamente 2cm de di\xE2metro, lisa e reluzente como uma p\xE9rola, mas de cor vermelho-vivo. Voc\xEA pode gastar uma a\xE7\xE3o de movimento para for\xE7ar a p\xE9rola de sangue contra a sua pele e absorv\xEA-la, recebendo uma inje\xE7\xE3o de adrenalina que fornece +5 em testes de Agilidade, For\xE7a e Vigor e testes baseados nesses atributos at\xE9 o final da cena. Ao final da cena, voc\xEA precisa fazer um teste de Fortitude (DT 20). Se falhar, fica fatigado at\xE9 o final do dia. Se falhar por 5 ou mais, sofre uma parada card\xEDaca e fica morrendo. Se morrer dessa forma, voc\xEA se torna uma criatura de sangue de VD similar ao seu NEX, \xE0 escolha do mestre."
}, {
    name: "Punhos Enraivecidos",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um par de soqueiras feitas de um metal vermelho vivo e gravado com v\xE1rios s\xEDmbolos de Sangue. Seus ataques desarmados passam a causar 1d8 pontos de dano de Sangue. Sempre que acerta um ataque desarmado, pode fazer outro ataque desarmado contra o mesmo alvo, pagando 2 PE por cada ataque j\xE1 realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE, um segundo ataque extra gastando mais 4 PE e assim por diante, at\xE9 errar um ataque ou n\xE3o ter mais pontos de esfor\xE7o."
}, {
    name: "Seringa de Transfigura\xE7\xE3o",
    element: "Sangue",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Esta seringa \xE9 feita de um material estranho e de apar\xEAncia org\xE2nica, cheio de veias pulsantes. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para sugar o sangue de um alvo adjacente e encher a seringa (se o alvo n\xE3o for volunt\xE1rio, voc\xEA precisa acert\xE1-lo com um ataque corpo a corpo). Se houver sangue na seringa, voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para injet\xE1-lo em qualquer outra pessoa adjacente, que ter\xE1 sua apar\xEAncia transfigurada para a do dono do sangue, como se estivesse sob efeito do ritual Distorcer Apar\xEAncia, com dura\xE7\xE3o aumentada para um dia. Quando o efeito acabar, o alvo deve rolar 1d6. Em um resultado 1, o processo de voltar \xE0 sua apar\xEAncia \xE9 especialmente traum\xE1tico, danificando seus m\xFAsculos e \xF3rg\xE3os e fazendo com que ele perca 1 PV permanentemente."
}, {
    name: "Amarras Mortais",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um par de correntes de ferro negro que se enrolam nos antebra\xE7os do usu\xE1rio como um bracelete. Uma vez por rodada, voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 2 PE para usar a manobra agarrar contra um alvo Grande ou menor em alcance curto, recebendo +10 em seu teste oposto. Voc\xEA tamb\xE9m pode usar uma a\xE7\xE3o de movimento para puxar um alvo agarrado para perto, deixando-o adjacente."
}, {
    name: "Casaco de Lodo",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um sobretudo preto fosco que tem uma cor inexplicavelmente opaca, como se absorvesse a luz completamente. Essa vestimenta \xE9 na verdade feita de Lodo ativo, protegendo o usu\xE1rio contra ataques ao amortecer o impacto deles. O usu\xE1rio recebe resist\xEAncia a corte, impacto, Morte e perfura\xE7\xE3o 5, mas se torna vulner\xE1vel a dano bal\xEDstico e de Energia."
}, {
    name: "Coletora",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Este punhal possui a l\xE2mina completamente negra e a empunhadura em espiral. Voc\xEA pode gastar uma a\xE7\xE3o completa para apunhalar uma pessoa que esteja morrendo. Ao fazer isso, voc\xEA mata o alvo e a Coletora absorve os resqu\xEDcios do tempo de vida dela, armazenando 1d8 PE. O punhal pode armazenar um total de 20 PE, que voc\xEA pode usar como se fossem seus desde que esteja portando a adaga a pelo menos uma semana. Enquanto portar a adaga, voc\xEA \xE9 acometido por pesadelos sobre o sofrimento final de suas v\xEDtimas e sempre tem condi\xE7\xF5es de descanso ruins, independentemente de onde ou como descansar."
}, {
    name: "Cr\xE2nio Espiral",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um cr\xE2nio envelhecido, apodrecido e distorcido em um formato espiral. Lodo escorre de seus olhos vazios, como l\xE1grimas negras. Uma vez por rodada, se estiver empunhando o cr\xE2nio, voc\xEA pode gastar uma a\xE7\xE3o livre para ativ\xE1-lo. Quando faz isso, voc\xEA recebe uma a\xE7\xE3o padr\xE3o adicional na rodada. Sempre que usa o cr\xE2nio, voc\xEA deve fazer um teste de Vontade (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, voc\xEA recebe os benef\xEDcios do item, mas envelhece 1d4 anos e n\xE3o pode mais us\xE1-lo nesse dia."
}, {
    name: "Frasco de Lodo",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um pequeno frasco contendo lodo de Morte. Aplicar o conte\xFAdo do frasco em um ferimento \xE9 uma a\xE7\xE3o padr\xE3o. Se aplicado em um ferimento recente (sofrido at\xE9 uma rodada atr\xE1s) o lodo recupera 6d8+20 pontos de vida. Caso a ferida seja anterior \xE0 rodada passada, role um dado: em um resultado par, o lodo recupera 3d8+10 PV; em um resultado \xEDmpar, a ferida infecciona, causando 3d8+10 pontos de dano de Morte. O frasco possui lodo para uma \xFAnica ativa\xE7\xE3o."
}, {
    name: "Vislumbre do Fim",
    element: "Morte",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um par de \xF3culos escuros repleto de s\xEDmbolos e espirais em sua arma\xE7\xE3o met\xE1lica.  Voc\xEA pode gastar uma a\xE7\xE3o de movimento para se concentrar em um ser que esteja vendo e obter informa\xE7\xF5es sobre a morte dele. Em pessoas comuns, essa informa\xE7\xE3o se traduz em um contador de tempo, que pode se alterar conforme as a\xE7\xF5es de um marcado modificam seu futuro. Em Marcados ou criaturas, essas informa\xE7\xF5es se traduzem na informa\xE7\xE3o de qual \xE9 o pior valor de resist\xEAncia do alvo (entre Fortitude, Reflexos ou Vontade) e de quaisquer vulnerabilidades que o alvo possua."
}, {
    name: "An\xE9is do Elo Mental",
    element: "Conhecimento",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um par de an\xE9is dourados, cada um contendo um dos s\xEDmbolos do ritual Liga\xE7\xE3o Telep\xE1tica.  Os an\xE9is devem ser usados por duas pessoas por 24h para serem ativados. Ap\xF3s esse per\xEDodo, os dois s\xE3o conectados por um ritual de Invadir Mente (liga\xE7\xE3o telep\xE1tica) que dura enquanto estiverem usando os an\xE9is. Enquanto a liga\xE7\xE3o estiver ativa, as duas pessoas fazem testes de Vontade usando a melhor quantidade de dados e b\xF4nus entre as duas. Por\xE9m, qualquer dano mental sofrido por uma delas ser\xE1 sofrido pela outra (ou seja, se numa rodada ambas sofrerem 10 pontos de dano mental, cada uma ir\xE1 perder 20 pontos de sanidade) e qualquer condi\xE7\xE3o mental ou de medo que afetar uma delas automaticamente afetar\xE1 a outra."
}, {
    name: "Lanterna Reveladora",
    element: "Conhecimento",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma lanterna dourada decorada com sigilos do Outro Lado. Ativar a lanterna gasta uma a\xE7\xE3o padr\xE3o e 1 PE. Ela fica ligada por uma cena e emite luz com as propriedades do ritual Terceiro Olho. A luz da lanterna incomoda criaturas de Sangue. Se elas foram iluminadas pela luz dela, ir\xE3o atac\xE1-lo em detrimento de quaisquer outros alvos na mesma categoria de alcance."
}, {
    name: "M\xE1scara das Pessoas nas Sombras",
    element: "Conhecimento",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Principal ferramenta e marca registrada da Seita das M\xE1scaras, esse item quando usado por algu\xE9m que n\xE3o pertence \xE0 Seita ainda carrega grande poder. O usu\xE1rio recebe resist\xEAncia a Conhecimento 10 e pode gastar uma a\xE7\xE3o de movimento e 2 PE para \u201Centrar\u201D em uma sombra adjacente e se transportar instantaneamente para outra sombra que possa ver em alcance m\xE9dio. Vestir a M\xE1scara \xE9 como assinar um acordo e pode ter consequ\xEAncias severas se seu portador despertar o interesse da mente \xFAnica das M\xE1scaras..."
}, {
    name: "Muni\xE7\xE3o Jurada",
    element: "Conhecimento",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma bala de arma de fogo com um sigilo gravado. O usu\xE1rio pode fazer um ritual de uma hora para vincular essa muni\xE7\xE3o a um ser que conhe\xE7a. Se usada contra esse ser, a bala fornece +10 no teste de ataque, dobra a margem de amea\xE7a da arma e causa +6d12 pontos de dano de Conhecimento. Possuir uma muni\xE7\xE3o juramentada deixa o usu\xE1rio obcecado em abater seu alvo, impondo \u20132 em Defesa e em testes de ataque contra quaisquer outros alvos."
}, {
    name: "Peitoral da Segunda Chance",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um dispositivo que pode ser vestido como um pequeno colete que pode ser prendido ao redor do peito, contendo uma pe\xE7a central em cima do cora\xE7\xE3o formada por um amontoado de partes eletr\xF4nicas seguradas por fios met\xE1licos entrela\xE7ados, passando por baixo dos bra\xE7os e levando at\xE9 um fecho na parte das costas. Se voc\xEA for reduzido a 0 pontos de vida, o colete automaticamente gastar\xE1 5 PE seus para reanim\xE1-lo com 4d10 PV atrav\xE9s de um surto de Energia por todo o seu corpo. A reanima\xE7\xE3o falha se voc\xEA n\xE3o tiver PE suficiente. Cada vez que o item \xE9 ativado, existe uma chance (1 em 1d10) da descarga energ\xE9tica ser forte demais e mat\xE1-lo instantaneamente, transformando seu corpo e equipamento em plasma de Energia pura (exceto pelo colete)."
}, {
    name: "Pergaminho da Pertin\xE1cia",
    element: "Conhecimento",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um pergaminho amarelado e antigo. Mesmo enrolado, \xE9 poss\xEDvel vislumbrar sigilos dourados brilhando na parte interior. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para encarar os sigilos do Outro Lado inscritos no pergaminho, recebendo 5 PE tempor\xE1rios at\xE9 o fim da cena. Sempre que usa este item, voc\xEA deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, o pergaminho se desfaz."
}, {
    name: "Arcabuz dos Moretti",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma arma muito antiga, reminiscente do s\xE9culo XV, mas que de alguma forma ainda se mant\xE9m funcionando perfeitamente, apesar das rachaduras que cercam toda a superf\xEDcie do objeto e emitem uma suave luz rosada do interior de suas fissuras. Em seu cabo de madeira est\xE1 gravado um selo contendo a letra M. O arcabuz \xE9 uma arma simples, de fogo e de uma m\xE3o que fornece +2 em testes de ataque. Sempre que dispara esta arma, o usu\xE1rio deve rolar 1d6 junto com o teste de ataque. O resultado do d6 define qual o dano da arma nesse disparo: 1) 2d4, 2) 2d6, 3) 2d8, 4) 2d10, 5) 2d12, 6) 2d20. A arma tem alcance curto, cr\xEDtico x3 e n\xE3o precisa de muni\xE7\xE3o."
}, {
    name: "Bateria Reversa",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma pequena bateria el\xE9trica repleta de sigilos paranormais. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 2 PE para fazer a bateria absorver a carga de qualquer dispositivo eletr\xF4nico em alcance curto \u2014 celular, notebook ou mesmo um autom\xF3vel \u2014, fazendo-o ficar automaticamente descarregado. Se a bateria estiver cheia, voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o para transferir a carga dela para um dispositivo eletr\xF4nico descarregado em alcance curto, que \xE9 instantaneamente reenergizado. Sempre que usa a bateria, voc\xEA deve fazer um teste de Ocultismo (DT 15 + 5 por uso adicional no mesmo dia). Se falhar, ela explode, causando 12d6 pontos de dano de Energia em todos os seres a at\xE9 3 metros."
}, {
    name: "Rel\xF3gio de Arnaldo",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um rel\xF3gio de ouro, meio manchado e com um aspecto levemente queimado no exterior. Ao abrir, \xE9 poss\xEDvel enxergar a foto de um homem de barba e \xF3culos ao lado de uma crian\xE7a simp\xE1tica, tamb\xE9m segurando um rel\xF3gio de ouro. Uma vez por rodada, voc\xEA pode gastar 1 PE para rolar novamente qualquer dado com o resultado 1. O custo para usar o rel\xF3gio aumenta em +1 para cada vez que for ativado no mesmo dia."
}, {
    name: "Talism\xE3 da Sorte",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Uma figa, moeda, p\xE9 de coelho ou qualquer outro badulaque modificado por um ritual. Sempre que voc\xEA estiver vestindo o talism\xE3 e sofrer dano, pode gastar uma rea\xE7\xE3o e 3 PE para rolar 1d4. Em um resultado 2 ou 3, voc\xEA evita completamente o dano. Em um resultado 4, voc\xEA evita o dano, mas o talism\xE3 queima e vira cinzas. Por fim, em um resultado 1, a sorte se reverte em azar: em vez de evitar o dano, voc\xEA sofre o dobro do dano que sofreria e o talism\xE3 queima e vira cinzas."
}, {
    name: "Teclado de Conex\xE3o Neural",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um teclado USB coberto de glifos de Energia. Sempre que voc\xEA plugar o teclado a um computador (uma a\xE7\xE3o de movimento), o item ir\xE1 gerar ondas eletromagn\xE9ticas que enviam os sinais do sistema diretamente para as sinapses de seu c\xE9rebro, efetivamente conectando a sua mente com a m\xE1quina. Voc\xEA pode usar o computador sem nenhum impedimento tecnol\xF3gico ou de idioma, recebe +10 em testes para hackear e gasta metade do tempo normal para localizar arquivos. Por\xE9m, devido ao estresse que seu c\xE9rebro sofre por se conectar diretamente a um sistema digital, voc\xEA sofre 1d6 pontos de dano mental por rodada que usar o teclado."
}, {
    name: "Tela do Pesadelo",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Este dispositivo com tela (celular, tablet, TV...) cont\xE9m diversos sigilos min\xFAsculos em suas bordas. Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 2 PE para ativar a tela. A pr\xF3xima pessoa que toc\xE1-la ver\xE1 uma imagem horr\xEDvel saindo da tela e avan\xE7ando contra ela. A imagem \xE9 apenas uma ilus\xE3o, mas os traumas que ela causa s\xE3o reais! A pessoa deve fazer um teste de Vontade (DT determinada pelo usu\xE1rio da tela +5). Se falhar, fica atordoada, sofre 4d6 pontos de dano mental e precisa repetir o teste na pr\xF3xima rodada. O efeito continua at\xE9 a pessoa passar no teste ou enlouquecer (ou outra pessoa destruir a tela). Uma vez que gere esse efeito, a tela fica inerte at\xE9 voc\xEA ativ\xE1-la novamente."
}, {
    name: "Ve\xEDculo Energizado",
    element: "Energia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "O motor deste ve\xEDculo foi modificado paranormalmente para n\xE3o precisar de combust\xEDvel. Al\xE9m disso, um motorista pode gastar uma rea\xE7\xE3o e fazer um teste de Pilotagem (DT 25) para fazer o carro e seus ocupantes assumirem uma forma de energia pura por um instante, suficiente para evitar colidir com um objeto, atravessando-o como se fossem incorp\xF3reos."
}, {
    name: "Jaqueta de Ver\xEDssimo",
    element: "Medo",
    itemType: "cursedItem",
    category: "IV",
    slots: 1,
    description: "Uma jaqueta de estilo aviador feita de couro marrom com a gola forrada de pele branca. Esta vestimenta de apar\xEAncia comum j\xE1 foi usada por v\xE1rios agentes importantes e experientes da Ordem, e presenciou in\xFAmeras batalhas e sacrif\xEDcios. Ao longo de sua hist\xF3ria, a jaqueta foi passada de um agente para o outro como presente ou heran\xE7a diversas vezes. Voc\xEA recebe resist\xEAncia a dano paranormal 15. Al\xE9m disso, sempre que um aliado adjacente for sofrer dano de qualquer tipo, voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para se tornar o alvo do dano no lugar. Este \xE9 um item \xFAnico (apenas um agente pode escolh\xEA-la) de categoria IV."
}, {
    name: "Dedo Decepado",
    element: "Varia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Este item grotesco \xE9 um dedo decepado e seco de algu\xE9m com alto n\xEDvel de exposi\xE7\xE3o paranormal. Voc\xEA recebe um poder paranormal que o dono do dedo possu\xEDa. O elemento do poder define o elemento da maldi\xE7\xE3o. Sempre que usar as a\xE7\xF5es dormir ou relaxar em um interl\xFAdio, role 1d4. Em um resultado 1, voc\xEA \xE9 assombrado por mem\xF3rias do dono do dedo e n\xE3o recupera nenhum PV, PE ou sanidade. Al\xE9m disso, ser visto usando esse item causa uma penalidade de \u201310 em testes de Diplomacia e pode causar rea\xE7\xF5es severas de NPCs, a crit\xE9rio do mestre. Voc\xEA precisa vestir o item por uma semana para que seu efeito comece a funcionar."
}, {
    name: "Selos Paranormais",
    element: "Varia",
    itemType: "cursedItem",
    category: "II",
    slots: 1,
    description: "Um conjunto de sigilos gravados em um objeto pequeno, como um pergaminho, moeda, pedra preciosa, osso humano... Cada selo cont\xE9m um ritual. Para ativar um selo, voc\xEA deve empunh\xE1-lo e ler os sigilos em voz alta. Isso exige uma a\xE7\xE3o padr\xE3o ou a a\xE7\xE3o necess\xE1ria para conjurar o ritual, o que for maior. Voc\xEA tamb\xE9m deve conhecer o ritual inscrito nele ou passar em um teste de Ocultismo (DT 20 + custo em PE do ritual).Quando o selo \xE9 ativado, o ritual \xE9 conjurado e o selo se desfaz em cinzas. Voc\xEA sofre os efeitos das regras \u201CO Custo do Paranormal\u201D e \u201CInvocando o Medo\u201D, caso aplic\xE1veis, e toma quaisquer decis\xF5es exigidas pelo ritual, como se o tivesse conjurado voc\xEA mesmo. Caso conhe\xE7a o ritual, voc\xEA pode aplicar quaisquer habilidades que possua que se aplicariam aos seus pr\xF3prios rituais, e pode usar vers\xF5es avan\xE7adas dele, pagando o custo adicional em pontos de esfor\xE7o (e apenas o custo adicional). Voc\xEA n\xE3o precisa de componentes ritual\xEDsticos para ativar um selo, o que o torna um objeto bastante \xFAtil para ocultistas em certas situa\xE7\xF5es.A categoria de um selo \xE9 igual ao c\xEDrculo do ritual contido nele: categoria I para rituais de 1\xBA c\xEDrculo, categoria II para rituais de 2\xBA c\xEDrculo, e assim por diante."
}]
// endregion

// region poderes
const poderes = [
    {
    name: "Aprender Ritual",
    element: "Varia",
    description: "Atrav\xE9s de uma conex\xE3o com as mem\xF3rias de ocultistas do passado e os segredos das entidades, voc\xEA aprende e pode conjurar um ritual de 1\xBA c\xEDrculo \xE0 sua escolha. Al\xE9m disso, voc\xEA pode substituir um ritual que j\xE1 conhece por outro. A partir de 45% de NEX, quando escolhe este poder, voc\xEA aprende um ritual de at\xE9 2\xBA c\xEDrculo e, a partir de 75% de NEX, aprende um ritual de at\xE9 3\xBA c\xEDrculo. Voc\xEA pode escolher esse poder quantas vezes quiser, mas est\xE1 sujeito ao limite de rituais conhecidos. Este poder conta como um poder do elemento do ritual escolhido."
}, {
    name: "Resistir a <Elemento>",
    element: "Varia",
    description: "Escolha entre Conhecimento, Energia, Morte ou Sangue. Voc\xEA recebe resist\xEAncia 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.\nAfinidade: aumenta a resist\xEAncia para 20."
}, {
    name: "Expans\xE3o de Conhecimento",
    element: "Conhecimento",
    description: "Voc\xEA se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreens\xE3o. Voc\xEA aprende um poder de classe que n\xE3o perten\xE7a \xE0 sua classe (caso o poder possua pr\xE9-requisitos, voc\xEA precisa preench\xEA-los). Pr\xE9-requisito: Conhecimento 1.\nAfinidade: voc\xEA aprende um segundo poder de classe que n\xE3o perten\xE7a \xE0 sua classe."
}, {
    name: "Percep\xE7\xE3o Paranormal",
    element: "Conhecimento",
    description: "O Conhecimento sussurra em sua mente. Em cenas de investiga\xE7\xE3o, sempre que fizer um teste para procurar pistas, voc\xEA pode rolar novamente um dado com resultado menor que 10. Voc\xEA deve aceitar a segunda rolagem, mesmo que seja menor que a primeira.\nAfinidade: voc\xEA pode rolar novamente at\xE9 dois dados com resultado menor que 10."
}, {
    name: "Precogni\xE7\xE3o",
    element: "Conhecimento",
    description: "Voc\xEA possui um \u201Csexto sentido\u201D que o avisa do perigo antes que ele aconte\xE7a. Voc\xEA recebe +2 em Defesa e em testes de resist\xEAncia. Pr\xE9-requisito: Conhecimento 1.\nAfinidade: voc\xEA fica imune \xE0 condi\xE7\xE3o desprevenido."
}, {
    name: "Sensitivo",
    element: "Conhecimento",
    description: "Voc\xEA consegue sentir as emo\xE7\xF5es e inten\xE7\xF5es de outros personagens, como medo, raiva ou mal\xEDcia, recebendo +5 em testes de Diplomacia, Intimida\xE7\xE3o e Intui\xE7\xE3o.\nAfinidade: quando voc\xEA faz um teste oposto usando uma dessas per\xEDcias, o oponente sofre \u20131d20."
}, {
    name: "Vis\xE3o do Oculto",
    element: "Conhecimento",
    description: "Voc\xEA n\xE3o enxerga mais pelos olhos, mas sim pela percep\xE7\xE3o do Conhecimento em sua mente. Voc\xEA recebe +5 em testes de Percep\xE7\xE3o e enxerga no escuro.\nAfinidade: voc\xEA ignora camuflagem."
}, {
    name: "Afortunado",
    element: "Energia",
    description: "A Energia considera resultados med\xEDocres entediantes. Uma vez por rolagem, voc\xEA pode rolar novamente um resultado 1 em qualquer dado que n\xE3o seja d20.\nAfinidade: al\xE9m disso, uma vez por teste, voc\xEA pode rolar novamente um resultado 1 em d20."
}, {
    name: "Campo Protetor",
    element: "Energia",
    description: "Voc\xEA consegue gerar um campo de Energia que o protege de perigos. Quando usa a a\xE7\xE3o esquiva, voc\xEA pode gastar 1 PE para receber +5 em Defesa. Pr\xE9-requisito: Energia 1.\nAfinidade: quando usa este poder, voc\xEA tamb\xE9m recebe +5 em Reflexo e, at\xE9 o in\xEDcio de seu pr\xF3ximo turno, se passar em um teste de Reflexo que reduziria o dano \xE0 metade, em vez disso n\xE3o sofre nenhum dano."
}, {
    name: "Causalidade Fortuita",
    element: "Energia",
    description: "A Energia o conduz rumo \xE0 descobertas. Em cenas de investiga\xE7\xE3o, a DT para procurar pistas diminui em -5 para voc\xEA at\xE9 voc\xEA encontrar uma pista.\nAfinidade: a DT para procurar pistas sempre diminui em \u20135 para voc\xEA."
}, {
    name: "Golpe de Sorte",
    element: "Energia",
    description: "Seus ataques recebem +1 na margem de amea\xE7a. Pr\xE9-requisito: Energia 1.\nAfinidade: seus ataques recebem +1 no multiplicador de cr\xEDtico."
}, {
    name: "Manipular Entropia",
    element: "Energia",
    description: "Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior. Voc\xEA pode gastar 2 PE para fazer um alvo em alcance curto (exceto voc\xEA mesmo) rolar novamente um dos dados em um teste de per\xEDcia. Pr\xE9-requisito: Energia 1.\nAfinidade: o alvo rola novamente todos os dados que voc\xEA escolher."
}, {
    name: "Encarar a Morte",
    element: "Morte",
    description: "Sua conex\xE3o com a Morte faz com que voc\xEA n\xE3o hesite em situa\xE7\xF5es de perigo. Durante cenas de a\xE7\xE3o, seu limite de gasto de PE aumenta em +1 (isso n\xE3o afeta a DT de seus efeitos).\nAfinidade: durante cenas de a\xE7\xE3o, seu limite de gasto de PE aumenta em +2 (para um total de +3)."
}, {
    name: "Escapar da Morte",
    element: "Morte",
    description: "A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, voc\xEA fica com 1 PV. N\xE3o funciona em caso de dano massivo. Pr\xE9-requisito: Morte 1.\nAfinidade: em vez do normal, voc\xEA evita completamente o dano. Em caso de dano massivo, voc\xEA fica com 1 PV."
}, {
    name: "Potencial Aprimorado",
    element: "Morte",
    description: "A Morte lhe concede potencial latente de momentos roubados de outro lugar. Voc\xEA recebe +1 ponto de esfor\xE7o por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 30%, recebe 6 PE. Quando subir para NEX 35%, recebe +1 PE adicional, e assim por diante.\nAfinidade: voc\xEA recebe +1 PE adicional por NEX (para um total de +2 PE por NEX)."
}, {
    name: "Potencial Reaproveitado",
    element: "Morte",
    description: "Voc\xEA absorve os momentos desperdi\xE7ados de outros seres. Uma vez por rodada, quando passa num teste de resist\xEAncia, voc\xEA ganha 2 PE tempor\xE1rios cumulativos. Os pontos desaparecem no final da cena.\nAfinidade: voc\xEA ganha 3 PE tempor\xE1rios, em vez de 2."
}, {
    name: "Surto Temporal",
    element: "Morte",
    description: "A sua percep\xE7\xE3o temporal se torna distorcida e espiralizada, fazendo com que a no\xE7\xE3o de passagem do tempo nunca mais seja a mesma para voc\xEA. Uma vez por cena, durante seu turno, voc\xEA pode gastar 3 PE para realizar uma a\xE7\xE3o padr\xE3o adicional. Pr\xE9-requisito: Morte 2.\nAfinidade: em vez de uma vez por cena, voc\xEA pode usar este poder uma vez por turno."
}, {
    name: "Anatomia Insana",
    element: "Sangue",
    description: "O seu corpo \xE9 transfigurado e parece desenvolver um instinto pr\xF3prio separado da sua consci\xEAncia. Voc\xEA tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto cr\xEDtico ou ataque furtivo. Pr\xE9-requisito: Sangue 2.\nAfinidade: voc\xEA \xE9 imune aos efeitos de acertos cr\xEDticos e ataques furtivos."
}, {
    name: "Arma de Sangue",
    element: "Sangue",
    description: "O Sangue devora parte de seu corpo e se manifesta como parte de voc\xEA. Voc\xEA pode gastar uma a\xE7\xE3o de movimento e 2 PE para produzir garras, chifres ou uma l\xE2mina de sangue cristalizado que brota de seu antebra\xE7o. Qualquer que seja sua escolha, \xE9 considerada uma arma simples leve que voc\xEA n\xE3o precisa empunhar e causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando voc\xEA usa a a\xE7\xE3o agredir, pode gastar 1 PE para fazer um ataque adicional com essa arma. A arma dura at\xE9 o final da cena, e ent\xE3o se desfaz numa po\xE7a de sangue coagulado.\nAfinidade: a arma se torna permanentemente parte de voc\xEA e causa 1d10 pontos de dano de Sangue."
}, {
    name: "Sangue de Ferro",
    element: "Sangue",
    description: "O seu sangue flui de forma paranormal e agressiva, concedendo vigor n\xE3o natural. Voc\xEA recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 50%, recebe 20 PV. Quando subir para NEX 55%, recebe +2 PV, e assim por diante.\nAfinidade: voc\xEA recebe +5 em Fortitude e se torna imune a venenos e doen\xE7as."
}, {
    name: "Sangue Fervente",
    element: "Sangue",
    description: "A intensidade da dor desperta em voc\xEA sentimentos bestiais e prazerosos que voc\xEA nem imaginava que existiam. Enquanto estiver machucado, voc\xEA recebe +1 em Agilidade ou For\xE7a, \xE0 sua escolha (escolha sempre que este efeito for ativado). Pr\xE9-requisito: Sangue 2.\nAfinidade: o b\xF4nus que voc\xEA recebe em Agilidade ou For\xE7a aumenta para +2."
}, {
    name: "Sangue Vivo",
    element: "Sangue",
    description: "A carnificina n\xE3o pode parar, o Sangue precisa continuar fluindo. Na primeira vez que ficar machucado durante uma cena, voc\xEA recebe cura acelerada 2. Esse efeito nunca cura voc\xEA acima da metade dos PV m\xE1ximos (ou seja, voc\xEA nunca deixa de estar machucado) e termina no fim da cena ou caso voc\xEA perca a condi\xE7\xE3o machucado. Pr\xE9-requisito: Sangue 1.\nAfinidade: a cura acelerada aumenta para 5."
}]
// endregion

// region habilidades/poderesDeTrilha
var habilidades = [
    {
        name: "Combatente",
        abilities: [{
            name: "Ataque Especial",
            description: "Quando faz um ataque, voc\xEA pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avan\xE7a de NEX, voc\xEA pode gastar +1 PE para receber mais b\xF4nus de +5. Voc\xEA pode aplicar cada b\xF4nus de +5 em ataque ou dano. Por exemplo, em NEX 55%, voc\xEA pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano."
        }],
        powers: [{
            name: "Armamento Pesado",
            description: "Voc\xEA recebe profici\xEAncia com armas pesadas. Pr\xE9-requisito: For 2."
        }, {
            name: "Artista Marcial",
            description: "Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas \xE1geis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10."
        }, {
            name: "Ataque de Oportunidade",
            description: "Sempre que um ser sair voluntariamente de um espa\xE7o adjacente ao seu, voc\xEA pode gastar uma rea\xE7\xE3o e 1 PE para fazer um ataque corpo a corpo contra ele."
        }, {
            name: "Combater com Duas Armas",
            description: "Se estiver usando duas armas (e pelo menos uma for leve) e fizer a a\xE7\xE3o agredir, voc\xEA pode fazer dois ataques, um com cada arma. Se fizer isso, sofre \u20131d20 em todos os testes de ataque at\xE9 o seu pr\xF3ximo turno. Pr\xE9-requisitos: Agi 3, treinado em Luta ou Pontaria."
        }, {
            name: "Combate Defensivo",
            description: "Quando usa a a\xE7\xE3o agredir, voc\xEA pode combater defensivamente. Se fizer isso, at\xE9 seu pr\xF3ximo turno, sofre \u20131d20 em todos os testes de ataque, mas recebe +5 na Defesa. Pr\xE9-requisito: Int 2."
        }, {
            name: "Golpe Demolidor",
            description: "Quando usa a manobra quebrar ou ataca um objeto, voc\xEA pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pr\xE9-requisitos: For 2, treinado em Luta."
        }, {
            name: "Golpe Pesado",
            description: "O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo."
        }, {
            name: "Incans\xE1vel",
            description: "Uma vez por cena, voc\xEA pode gastar 2 PE para fazer uma a\xE7\xE3o de investiga\xE7\xE3o adicional, mas deve usar For\xE7a ou Agilidade como atributo-base do teste."
        }, {
            name: "Presteza Atl\xE9tica",
            description: "Quando faz um teste de facilitar a investiga\xE7\xE3o, voc\xEA pode gastar 1 PE para usar For\xE7a ou Agilidade no lugar do atributo-base da per\xEDcia. Se passar no teste, o pr\xF3ximo aliado que usar seu b\xF4nus tamb\xE9m recebe +1d20 no teste."
        }, {
            name: "Prote\xE7\xE3o Pesada",
            description: "Voc\xEA recebe profici\xEAncia com Prote\xE7\xF5es Pesadas. Pr\xE9-requisito: NEX 30%."
        }, {
            name: "Reflexos Defensivos",
            description: "Voc\xEA recebe +2 em Defesa e em testes de resist\xEAncia. Pr\xE9-requisitos: Agi 2."
        }, {
            name: "Saque R\xE1pido",
            description: "Voc\xEA pode sacar ou guardar itens como uma a\xE7\xE3o livre (em vez de a\xE7\xE3o de movimento). Al\xE9m disso, caso esteja usando a regra opcional de contagem de muni\xE7\xE3o, uma vez por rodada pode recarregar uma arma de disparo como uma a\xE7\xE3o livre. Pr\xE9-requisito: treinado em Iniciativa."
        }, {
            name: "Segurar o Gatilho",
            description: "Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque j\xE1 realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, at\xE9 errar um ataque ou atingir o limite de seus PE por rodada. Pr\xE9-requisito: NEX 60%."
        }, {
            name: "Sentido T\xE1tico",
            description: "Voc\xEA pode gastar uma a\xE7\xE3o de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um b\xF4nus em Defesa e em testes de resist\xEAncia igual ao seu Intelecto at\xE9 o final da cena. Pr\xE9-requisitos: treinado em Percep\xE7\xE3o e T\xE1tica."
        }, {
            name: "Tanque de Guerra",
            description: "Se estiver usando uma prote\xE7\xE3o pesada, a Defesa e a resist\xEAncia a dano que ela fornece aumentam em +2. Pr\xE9-requisito: Prote\xE7\xE3o Pesada."
        }, {
            name: "Tiro Certeiro",
            description: "Se estiver usando uma arma de disparo, voc\xEA soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se n\xE3o usar a a\xE7\xE3o mirar). Pr\xE9-requisito: treinado em Pontaria."
        }, {
            name: "Tiro de Cobertura",
            description: "Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 1 PE para disparar uma arma de fogo na dire\xE7\xE3o de um personagem no alcance da arma apenas para for\xE7\xE1-lo a se proteger. Fa\xE7a um teste de Pontaria contra a Vontade do alvo. Se vencer, at\xE9 o in\xEDcio do seu pr\xF3ximo turno o alvo n\xE3o pode sair do lugar onde est\xE1 e sofre \u20135 em testes de ataque. A crit\xE9rio do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este \xE9 um efeito de medo."
        }, {
            name: "Transcender",
            description: "Escolha um poder paranormal. Voc\xEA recebe o poder escolhido, mas n\xE3o ganha Sanidade neste aumento de NEX. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }, {
            name: "Treinamento em Per\xEDcia",
            description: "Escolha duas per\xEDcias. Voc\xEA se torna treinado nessas per\xEDcias. A partir de NEX 35%, voc\xEA pode escolher per\xEDcias nas quais j\xE1 \xE9 treinado para se tornar veterano. A partir de NEX 70%, pode escolher per\xEDcias nas quais j\xE1 \xE9 veterano para se tornar expert. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }],
        paths: [{
            name: "Aniquilador",
            description: "Voc\xEA \xE9 treinado para abater alvos com efici\xEAncia e velocidade. Suas armas s\xE3o suas melhores amigas e voc\xEA cuida t\xE3o bem delas quanto de seus companheiros de equipe. Talvez at\xE9 melhor.",
            abilities: [{
                name: "NEX 10% - A Favorita",
                description: "Escolha uma arma para ser sua favorita, como katana ou fuzil de assalto. A categoria da arma escolhida \xE9 reduzida em I."
            }, {
                name: "NEX 40% - T\xE9cnica Secreta",
                description: "A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, voc\xEA pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Voc\xEA pode adicionar mais efeitos gastando +2 PE por efeito adicional.\nAmplo. O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos).\nDestruidor. Aumenta o multiplicador de cr\xEDtico da arma em +1."
            }, {
                name: "NEX 65% - T\xE9cnica Sublime",
                description: "Voc\xEA adiciona os seguintes efeitos \xE0 lista de sua T\xE9cnica Secreta:\nLetal. Aumenta a margem de amea\xE7a em +2. Voc\xEA pode escolher este efeito duas vezes para aumentar a margem de amea\xE7a em +5.\nPerfurante. Ignora at\xE9 5 pontos de resist\xEAncia a dano de qualquer tipo do alvo."
            }, {
                name: "NEX 99% - M\xE1quina de Matar",
                description: "A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de amea\xE7a e seu dano aumenta em um dado do mesmo tipo."
            }]
        }, {
            name: "Comandante de Campo",
            description: "Sem um oficial uma batalha n\xE3o passa de uma briga de bar. Voc\xEA \xE9 treinado para coordenar e auxiliar seus companheiros em combate, tomando decis\xF5es r\xE1pidas e tirando melhor proveito da situa\xE7\xE3o e do talento de seus aliados.",
            abilities: [{
                name: "NEX 10% - Inspirar Confian\xE7a",
                description: "Sua lideran\xE7a inspira seus aliados. Voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para fazer um aliado em alcance curto rolar novamente um teste rec\xE9m realizado."
            }, {
                name: "NEX 40% - Estrategista",
                description: "Voc\xEA pode direcionar aliados em alcance curto. Gaste uma a\xE7\xE3o padr\xE3o e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No pr\xF3ximo turno dos aliados afetados, eles ganham uma a\xE7\xE3o de movimento adicional."
            }, {
                name: "NEX 65% - Brecha na Guarda",
                description: "Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para que voc\xEA ou outro aliado em alcance curto fa\xE7a um ataque adicional contra o mesmo inimigo. Al\xE9m disso, o alcance de inspirar confian\xE7a e estrategista aumenta para m\xE9dio."
            }, {
                name: "NEX 99% - Oficial Comandante",
                description: "Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 5 PE para que cada aliado que voc\xEA possa ver em alcance m\xE9dio receba uma a\xE7\xE3o padr\xE3o adicional no pr\xF3ximo turno dele."
            }]
        }, {
            name: "Guerreiro",
            description: "Voc\xEA treinou sua musculatura e movimentos a ponto de transformar seu corpo em uma verdadeira arma. Com golpes corpo a corpo t\xE3o poderosos quanto uma bala, voc\xEA encara os perigos de frente.",
            abilities: [{
                name: "NEX 10% - T\xE9cnica Letal",
                description: "Voc\xEA recebe um aumento de +2 na margem de amea\xE7a com todos os seus ataques corpo a corpo."
            }, {
                name: "NEX 40% - Revidar",
                description: "Sempre que bloquear um ataque, voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou."
            }, {
                name: "NEX 65% - For\xE7a Opressora",
                description: "Quando acerta um ataque corpo a corpo, voc\xEA pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como a\xE7\xE3o livre. Se escolher empurrar, recebe um b\xF4nus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, voc\xEA pode gastar 1 PE para fazer um ataque adicional contra o alvo ca\xEDdo."
            }, {
                name: "NEX 99% - Pot\xEAncia M\xE1xima",
                description: "Quando usa seu Ataque Especial com armas corpo a corpo, todos os b\xF4nus num\xE9ricos s\xE3o dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, voc\xEA recebe +10 no ataque e +30 no dano."
            }]
        }, {
            name: "Opera\xE7\xF5es Especiais",
            description: "Voc\xEA \xE9 um combatente eficaz, e suas a\xE7\xF5es s\xE3o calculadas e otimizadas, sempre antevendo os movimentos inimigos e se posicionando da maneira mais inteligente no campo de batalha.",
            abilities: [{
                name: "NEX 10% - Iniciativa Aprimorada",
                description: "Voc\xEA recebe +5 em Iniciativa e uma a\xE7\xE3o de movimento adicional na primeira rodada."
            }, {
                name: "NEX 40% - Ataque Extra",
                description: "Uma vez por rodada, quando faz um ataque, voc\xEA pode gastar 2 PE para fazer um ataque adicional."
            }, {
                name: "NEX 65% - Surto de Adrenalina",
                description: "Uma vez por rodada, voc\xEA pode gastar 5 PE para realizar uma a\xE7\xE3o padr\xE3o ou de movimento adicional."
            }, {
                name: "NEX 99% - Sempre Alerta",
                description: "Voc\xEA recebe uma a\xE7\xE3o padr\xE3o adicional no in\xEDcio de cada cena de combate."
            }]
        }, {
            name: "Tropa de Choque",
            description: "Voc\xEA \xE9 duro na queda. Treinou seu corpo para resistir a traumas f \xEDsicos, tornando-o praticamente inquebr\xE1vel, e por isso n\xE3o teme se colocar entre seus aliados e o perigo.",
            abilities: [{
                name: "NEX 10% - Casca Grossa",
                description: "Voc\xEA recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resist\xEAncia a dano recebida."
            }, {
                name: "NEX 40% - Cai Dentro",
                description: "Sempre que um oponente em alcance curto ataca um de seus aliados, voc\xEA pode gastar uma rea\xE7\xE3o e 1 PE para fazer com que esse oponente fa\xE7a um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar voc\xEA em vez de seu aliado. Este poder s\xF3 funciona se voc\xEA puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque \xE0 dist\xE2ncia). Um oponente que passe no teste de Vontade n\xE3o pode ser afetado por seu poder Cai Dentro at\xE9 o final da cena."
            }, {
                name: "NEX 65% - Duro de Matar",
                description: "Ao sofrer dano n\xE3o paranormal, voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para reduzir esse dano \xE0 metade. Em NEX 85%, voc\xEA pode usar esta habilidade para reduzir dano paranormal."
            }, {
                name: "NEX 99% - Inquebr\xE1vel",
                description: "Enquanto estiver machucado, voc\xEA recebe +5 na Defesa e resist\xEAncia a dano 5. Enquanto estiver morrendo, em vez do normal, voc\xEA n\xE3o fica indefeso e ainda pode realizar a\xE7\xF5es. Voc\xEA ainda segue as regras de morte normalmente."
            }]
        }]
    },

    {
        name: "Especialista",
        abilities: [{
            name: "Ecl\xE9tico",
            description: "Quando faz um teste de uma per\xEDcia, voc\xEA pode gastar 2 PE para receber os benef\xEDcios de ser treinado nesta per\xEDcia."
        }, {
            name: "Perito",
            description: "Escolha duas per\xEDcias nas quais voc\xEA \xE9 treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas per\xEDcias, voc\xEA pode gastar 2 PE para somar +1d6 no resultado do teste. Conforme avan\xE7a de NEX, voc\xEA pode gastar +1 PE para aumentar o dado de b\xF4nus. Por exemplo, em NEX 55%, pode gastar 4 PE para receber +1d10 no teste."
        }],
        powers: [{
            name: "Artista Marcial",
            description: "Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas \xE1geis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10."
        }, {
            name: "Bal\xEDstica Avan\xE7ada",
            description: "Voc\xEA recebe profici\xEAncia com armas t\xE1ticas de fogo e +2 em rolagens de dano com essas armas."
        }, {
            name: "Conhecimento Aplicado",
            description: "Quando faz um teste de per\xEDcia (exceto Luta e Pontaria), voc\xEA pode gastar 2 PE para mudar o atributo-base da per\xEDcia para Int. Pr\xE9-requisito: Int 2."
        }, {
            name: "Engenhosidade",
            description: "Em NEX 40%, quando usa sua habilidade Ecl\xE9tico, voc\xEA pode gastar 2 PE adicionais para receber os benef\xEDcios de ser veterano na per\xEDcia. Em NEX 75%, pode gastar 4 PE adicionais para receber os benef\xEDcios de ser expert na per\xEDcia."
        }, {
            name: "Hacker",
            description: "Voc\xEA recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necess\xE1rio para hackear qualquer sistema para uma a\xE7\xE3o completa. Pr\xE9-requisito: treinado em Tecnologia."
        }, {
            name: "M\xE3os R\xE1pidas",
            description: "Ao fazer um teste de Crime, voc\xEA pode pagar 1 PE para faz\xEA-lo como uma a\xE7\xE3o livre. Pr\xE9-requisitos: Agi 3, treinado em Crime."
        }, {
            name: "Mochila de Utilidades",
            description: "Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espa\xE7o a menos."
        }, {
            name: "Movimento T\xE1tico",
            description: "Voc\xEA pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno dif\xEDcil e por escalar at\xE9 o final do turno. Pr\xE9-requisito: treinado em Atletismo."
        }, {
            name: "Na Trilha Certa",
            description: "Sempre que tiver sucesso em um teste para procurar pistas, voc\xEA pode gastar 1 PE para receber +1d20 no pr\xF3ximo teste. Os custos e os b\xF4nus s\xE3o cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +2d20 no pr\xF3ximo teste, e assim por diante)."
        }, {
            name: "Nerd",
            description: "Voc\xEA \xE9 um reposit\xF3rio de conhecimento \xFAtil (e in\xFAtil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informa\xE7\xE3o \xFAtil para essa cena (se for uma investiga\xE7\xE3o, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informa\xE7\xE3o pode ser desde um livro antigo que voc\xEA leu na biblioteca at\xE9 um epis\xF3dio de sua s\xE9rie de fic\xE7\xE3o favorita."
        }, {
            name: "Ninja Urbano",
            description: "Voc\xEA recebe profici\xEAncia com armas t\xE1ticas de ataque corpo a corpo e de disparo (exceto de fogo) +2 em rolagens de dano com essas armas."
        }, {
            name: "Pensamento \xC1gil",
            description: "Uma vez por rodada, durante uma cena de investiga\xE7\xE3o, voc\xEA pode gastar 2 PE para fazer uma a\xE7\xE3o de procurar pistas adicional."
        }, {
            name: "Perito em Explosivos",
            description: "Voc\xEA soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explos\xE3o um n\xFAmero de alvos igual ao seu valor de Intelecto."
        }, {
            name: "Primeira Impress\xE3o",
            description: "Voc\xEA recebe +2d20 no primeiro teste de Diplomacia, Engana\xE7\xE3o, Intimida\xE7\xE3o ou Intui\xE7\xE3o que fizer em uma cena."
        }, {
            name: "Transcender",
            description: "Escolha um poder paranormal. Voc\xEA recebe o poder escolhido, mas n\xE3o ganha Sanidade neste aumento de NEX. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }, {
            name: "Treinamento em Per\xEDcia",
            description: "Escolha duas per\xEDcias. Voc\xEA se torna treinado nessas per\xEDcias. A partir de NEX 35%, voc\xEA pode escolher per\xEDcias nas quais j\xE1 \xE9 treinado para se tornar veterano. A partir de NEX 70%, pode escolher per\xEDcias nas quais j\xE1 \xE9 veterano para se tornar expert. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }],
        paths: [{
            name: "Atirador de Elite",
            description: "Um tiro, uma morte. Ao contr\xE1rio dos combatentes, voc\xEA \xE9 perito em neutralizar amea\xE7as de longe, terminando uma briga antes mesmo que ela comece. Voc\xEA trata sua arma como uma ferramenta de precis\xE3o, sendo capaz de executar fa\xE7anhas incr\xEDveis.",
            abilities: [{
                name: "NEX 10% - Mira de Elite",
                description: "Voc\xEA recebe profici\xEAncia com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas."
            }, {
                name: "NEX 40% - Disparo Letal",
                description: "Quando faz a a\xE7\xE3o mirar voc\xEA pode gastar 1 PE para aumentar em +2 a margem de amea\xE7a do pr\xF3ximo ataque que fizer at\xE9 o final de seu pr\xF3ximo turno."
            }, {
                name: "NEX 65% - Disparo Impactante",
                description: "Se estiver usando uma arma de fogo com calibre grosso voc\xEA pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar e quebrar usando um ataque a dist\xE2ncia."
            }, {
                name: "NEX 99% - Atirar para Matar",
                description: "Quando faz um acerto cr\xEDtico com uma arma de fogo, voc\xEA causa dano m\xE1ximo, sem precisar rolar dados."
            }]
        }, {
            name: "Infiltrador",
            description: "Voc\xEA \xE9 um perito em infiltra\xE7\xE3o e sabe neutralizar alvos desprevenidos sem causar alarde. Combinando talento acrob\xE1tico, destreza manual e conhecimento t\xE9cnico voc\xEA \xE9 capaz de superar qualquer barreira de defesa, mesmo quando a miss\xE3o parece imposs\xEDvel.",
            abilities: [{
                name: "NEX 10% - Ataque Furtivo",
                description: "Voc\xEA sabe atingir os pontos vitais de um inimigo distra\xEDdo. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que voc\xEA esteja flanqueando, voc\xEA pode gastar 1 PE para causar +1d6 pontos de dano do mesmo tipo da arma. Em NEX 40% o dano adicional aumenta para +2d6, em NEX 65% aumenta para +3d6 e em NEX 99% aumenta para +4d6."
            }, {
                name: "NEX 40% - Gatuno",
                description: "Voc\xEA recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a per\xEDcia Furtividade)."
            }, {
                name: "NEX 65% - Assassinar",
                description: "Voc\xEA pode gastar uma a\xE7\xE3o de movimento e 3 PE para analisar um alvo em alcance curto. At\xE9 o fim de seu pr\xF3ximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Al\xE9m disso, se sofrer dano de seu ataque, o alvo fica inconsciente ou morrendo, \xE0 sua escolha (Fortitude DT Agi evita)."
            }, {
                name: "NEX 99% - Sombra Fugaz",
                description: "Quando faz um teste de Furtividade ap\xF3s atacar ou fazer outra a\xE7\xE3o chamativa, voc\xEA pode gastar 3 PE para n\xE3o sofrer a penalidade de \u20133d20 no teste."
            }]
        }, {
            name: "M\xE9dico de Campo",
            description: "Voc\xEA \xE9 treinado em t\xE9cnicas de primeiros socorros e tratamento de emerg\xEAncia, o que torna voc\xEA um membro valioso para qualquer grupo de agentes. Ao contr\xE1rio dos profissionais de sa\xFAde convencionais, voc\xEA est\xE1 acostumado com o campo de batalha e sabe tomar decis\xF5es r\xE1pidas no meio do caos.\nEspecial: para escolher esta trilha, voc\xEA precisa ser treinado em Medicina. Para usar as habilidades desta trilha, voc\xEA precisa possuir um kit de medicina.",
            abilities: [{
                name: "NEX 10% - Param\xE9dico",
                description: "Voc\xEA pode usar uma a\xE7\xE3o padr\xE3o e 2 PE para curar 2d10 pontos de vida a de si mesmo ou de um aliado adjacente. Voc\xEA pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura."
            }, {
                name: "NEX 40% - Equipe de Trauma",
                description: "Voc\xEA pode usar uma a\xE7\xE3o padr\xE3o e 2 PE para remover uma condi\xE7\xE3o negativa (exceto morrendo) de um aliado adjacente."
            }, {
                name: "NEX 65% - Resgate",
                description: "Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, voc\xEA pode se aproximar do aliado com uma a\xE7\xE3o livre (desde que seja capaz de faz\xEA-lo usando seu deslocamento normal). Al\xE9m disso, sempre que curar PV ou remover condi\xE7\xF5es do aliado, voc\xEA e o aliado recebem +5 na Defesa at\xE9 o in\xEDcio de seu pr\xF3ximo turno. Por fim, para voc\xEA, o total de espa\xE7os ocupados por carregar um personagem \xE9 reduzido pela metade."
            }, {
                name: "NEX 99% - Reanima\xE7\xE3o",
                description: "Uma vez por cena, voc\xEA pode gastar uma a\xE7\xE3o completa e 10 PE para trazer de volta a vida um personagem que tenha morrido na mesma cena (exceto morte por dano massivo)."
            }]
        }, {
            name: "Negociador",
            description: "Voc\xEA \xE9 um diplomata habilidoso e consegue influenciar outras pessoas, seja por l\xE1bia ou intimida\xE7\xE3o. Sua capacidade de avaliar situa\xE7\xF5es com rapidez e efici\xEAncia pode tirar o grupo de apuros que nem a mais poderosa das armas poderia resolver.",
            abilities: [{
                name: "NEX 10% - Eloqu\xEAncia",
                description: "Voc\xEA pode usar uma a\xE7\xE3o completa e 1 PE por alvo em alcance curto para afetar outros personagens com sua fala. Fa\xE7a um teste de Diplomacia, Engana\xE7\xE3o ou Intimida\xE7\xE3o contra a Vontade dos alvos. Se voc\xEA vencer, os alvos ficam fascinados enquanto voc\xEA se concentrar (uma a\xE7\xE3o padr\xE3o por rodada). Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resist\xEAncia e tem direito a um novo teste por rodada, sempre que voc\xEA se concentrar Um personagem que passar no teste fica imune a este efeito por um dia."
            }, {
                name: "NEX 40% - Discurso Motivador",
                description: "Voc\xEA pode gastar uma a\xE7\xE3o padr\xE3o e 4 PE para inspirar seus aliados com suas palavras. Voc\xEA e todos os seus aliados em alcance curto ganham +1d20 em testes de per\xEDcia at\xE9 o fim da cena. A partir de NEX 65%, voc\xEA pode gastar 8 PE para fornecer um b\xF4nus total de +2d20."
            }, {
                name: "NEX 65% - Eu Conhe\xE7o um Cara",
                description: "Uma vez por miss\xE3o, voc\xEA pode ativar sua rede de contatos para pedir um favor, como por exemplo trocar todo o equipamento do seu grupo (como se tivesse uma segunda fase de prepara\xE7\xE3o de miss\xE3o), conseguir um local de descanso ou mesmo ser resgatado de uma cena. O mestre tem a palavra final de quando \xE9 poss\xEDvel usar essa habilidade e quais favores podem ser obtidos."
            }, {
                name: "NEX 99% - Truque de Mestre",
                description: "Acostumado a uma vida de fingimento e manipula\xE7\xE3o, voc\xEA pode gastar 5 PE para simular o efeito de qualquer habilidade que voc\xEA tenha visto um de seus aliados usar durante a cena. Voc\xEA ignora os pr\xE9-requisitos da habilidade, mas ainda precisa pagar todos os seus custos, incluindo a\xE7\xF5es, PE e materiais, e ela usa os seus par\xE2metros de jogo, como se voc\xEA estivesse usando a habilidade em quest\xE3o."
            }]
        }, {
            name: "T\xE9cnico",
            description: "Sua principal habilidade \xE9 a manuten\xE7\xE3o e reparo do valioso equipamento que seu time carrega em miss\xE3o. Seu conhecimento t\xE9cnico tamb\xE9m permite que improvise ferramentas com o que tiver \xE0 disposi\xE7\xE3o e sabote os itens usados por seus inimigos.",
            abilities: [{
                name: "NEX 10% - Invent\xE1rio Otimizado",
                description: "Voc\xEA soma seu Intelecto \xE0 sua For\xE7a para calcular sua capacidade de carga. Por exemplo, se voc\xEA tem For\xE7a 1 e Intelecto 3, seu invent\xE1rio tem 20 espa\xE7os."
            }, {
                name: "NEX 40% - Remend\xE3o",
                description: "Voc\xEA pode gastar uma a\xE7\xE3o completa e 1 PE para remover a condi\xE7\xE3o quebrado de um equipamento adjacente at\xE9 o final da cena. Al\xE9m disso, qualquer equipamento geral tem sua categoria reduzida em I para voc\xEA."
            }, {
                name: "NEX 65% - Improvisar",
                description: "Voc\xEA pode improvisar equipamentos com materiais ao seu redor. Escolha um equipamento geral e gaste uma a\xE7\xE3o completa e 2 PE, mais 2 PE por categoria do item escolhido. Voc\xEA cria uma vers\xE3o funcional do equipamento, que segue suas regras de espa\xE7o e categoria como normal. Ao final da cena, seu equipamento improvisado se torna in\xFAtil."
            }, {
                name: "NEX 99% - Preparado para Tudo",
                description: "Voc\xEA sempre tem o que precisa para qualquer situa\xE7\xE3o. Sempre que precisar de um item qualquer (exceto armas), pode gastar uma a\xE7\xE3o de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa! Depois de encontrado, o item segue normalmente as regras de invent\xE1rio."
            }]
        }],
    },

    {
        name: "Ocultista",
        abilities: [{
            name: "Escolhido pelo Outro Lado",
            description: "Voc\xEA teve uma experi\xEAncia paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necess\xE1rios para realizar rituais. Voc\xEA pode lan\xE7ar rituais de 1\xBA c\xEDrculo. \xC0 medida que aumenta seu NEX, pode lan\xE7ar rituais de c\xEDrculos maiores (2\xBA c\xEDrculo em NEX 25%, 3\xBA c\xEDrculo em NEX 55% e 4\xBA c\xEDrculo em NEX 85%). Voc\xEA come\xE7a com tr\xEAs rituais de 1\xBA c\xEDrculo. Sempre que avan\xE7a de NEX, aprende um ritual de qualquer c\xEDrculo que possa lan\xE7ar. Esses rituais n\xE3o contam no seu limite de rituais conhecidos."
        }],
        powers: [{
            name: "Camuflar Ocultismo",
            description: "Voc\xEA pode gastar uma a\xE7\xE3o livre para esconder s\xEDmbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invis\xEDveis para outras pessoas al\xE9m de voc\xEA mesmo. Al\xE9m disso, quando lan\xE7a um ritual, pode gastar +2 PE para lan\xE7\xE1-lo sem usar componentes ritual\xEDsticos e sem gesticular (o que permite conjurar um ritual com as m\xE3os presas), usando apenas concentra\xE7\xE3o. Outros seres s\xF3 perceber\xE3o que voc\xEA lan\xE7ou uma ritual se passarem num teste de Ocultismo (DT 25)."
        }, {
            name: "Criar Selo",
            description: "Voc\xEA sabe fabricar selos paranormais de rituais que conhe\xE7a. Fabricar um selo gasta uma a\xE7\xE3o de interl\xFAdio e um n\xFAmero de PE iguais ao custo de conjurar o ritual. Voc\xEA pode ter um n\xFAmero m\xE1ximo de selos criados a qualquer momento igual \xE0 sua Presen\xE7a."
        }, {
            name: "Envolto em Mist\xE9rio",
            description: "Sua apar\xEAncia e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente voc\xEA pode fazer e quem se encaixa nessa descri\xE7\xE3o. Como regra geral, voc\xEA recebe +5 em Engana\xE7\xE3o e Intimida\xE7\xE3o contra pessoas n\xE3o treinadas em Ocultismo."
        }, {
            name: "Especialista em Elemento",
            description: "Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2."
        }, {
            name: "Ferramentas Paranormais",
            description: "Voc\xEA reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE."
        }, {
            name: "Fluxo de Poder",
            description: "Voc\xEA pode manter dois efeitos sustentados de rituais ativos simultaneamente com apenas uma a\xE7\xE3o livre, pagando o custo de cada efeito separadamente. Pr\xE9-requisito: NEX 60%."
        }, {
            name: "Guiado pelo Paranormal",
            description: "Uma vez por cena, voc\xEA pode gastar 2 PE para fazer uma a\xE7\xE3o de investiga\xE7\xE3o adicional."
        }, {
            name: "Identifica\xE7\xE3o Paranormal",
            description: "Voc\xEA recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais."
        }, {
            name: "Improvisar Componentes",
            description: "Uma vez por cena, voc\xEA pode gastar uma a\xE7\xE3o completa para fazer um teste de Investiga\xE7\xE3o (DT 15). Se passar, encontra objetos que podem servir como componentes ritual\xEDsticos de um elemento \xE0 sua escolha. O mestre define se \xE9 poss\xEDvel usar esse poder na cena atual."
        }, {
            name: "Intui\xE7\xE3o Paranormal",
            description: "Sempre que usa a a\xE7\xE3o facilitar investiga\xE7\xE3o, voc\xEA soma seu Intelecto ou Presen\xE7a no teste (\xE0 sua escolha)."
        }, {
            name: "Mestre em Elemento",
            description: "Escolha um elemento. O custo para lan\xE7ar rituais desse elemento diminui em \u20131 PE. Pr\xE9-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%."
        }, {
            name: "Ritual Potente",
            description: "Voc\xEA soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pr\xE9-requisito: Int 2."
        }, {
            name: "Ritual Predileto",
            description: "Escolha um ritual que voc\xEA conhece. Voc\xEA reduz em \u20131 PE o custo do ritual. Essa redu\xE7\xE3o se acumula com redu\xE7\xF5es fornecidas por outras fontes."
        }, {
            name: "Tatuagem Ritual\xEDstica",
            description: "S\xEDmbolos marcados em sua pele reduzem em \u20131 PE o custo de rituais de alcance pessoal que t\xEAm voc\xEA como alvo."
        }, {
            name: "Transcender",
            description: "Escolha um poder paranormal. Voc\xEA recebe o poder escolhido, mas n\xE3o ganha Sanidade neste aumento de NEX. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }, {
            name: "Treinamento em Per\xEDcia",
            description: "Escolha duas per\xEDcias. Voc\xEA se torna treinado nessas per\xEDcias. A partir de NEX 35%, voc\xEA pode escolher per\xEDcias nas quais j\xE1 \xE9 treinado para se tornar veterano. A partir de NEX 70%, pode escolher per\xEDcias nas quais j\xE1 \xE9 veterano para se tornar expert. Voc\xEA pode escolher este poder v\xE1rias vezes."
        }],
        paths: [{
            name: "Condu\xEDte",
            description: "Voc\xEA domina os aspectos fundamentais da conjura\xE7\xE3o de rituais e \xE9 capaz de aumentar o alcance e velocidade de suas conjura\xE7\xF5es. Conforme sua conex\xE3o com as entidades paranormais aumenta voc\xEA se torna capaz de interferir com os rituais de outros ocultistas.",
            abilities: [{
                name: "NEX 10% - Ampliar Ritual",
                description: "Quando lan\xE7a um ritual, voc\xEA pode gastar +2 PE para aumentar seu alcance em um passo (de curto para m\xE9dio, de m\xE9dio para longo ou de longo para extremo) ou dobrar sua \xE1rea de efeito."
            }, {
                name: "NEX 40% - Acelerar Ritual",
                description: "Uma vez por rodada, voc\xEA pode aumentar o custo de um ritual em 4 PE para conjur\xE1-lo como uma a\xE7\xE3o livre."
            }, {
                name: "NEX 65% - Anular Ritual",
                description: "Quando for alvo de um ritual, voc\xEA pode gastar uma quantidade de PE igual ao custo pago por esse ritual e fazer um teste oposto de Ocultismo contra o conjurador. Se vencer, voc\xEA anula o ritual, cancelando todos os seus efeitos."
            }, {
                name: "NEX 99% - Canalizar o Medo",
                description: "Voc\xEA aprende o ritual Canalizar o Medo."
            }]
        }, {
            name: "Flagelador",
            description: "Dor \xE9 um poderoso catalisador Paranormal e voc\xEA aprendeu a transform\xE1-la em poder para seus rituais. Quando se torna especialmente poderoso, consegue usar a dor e o sofrimento de seus inimigos como instrumento de seus rituais ocultistas.",
            abilities: [{
                name: "NEX 10% - Poder do Flagelo",
                description: "Ao conjurar um ritual, voc\xEA pode gastar seus pr\xF3prios pontos de vida para pagar o custo em pontos de esfor\xE7o, \xE0 taxa de 2 PV por PE pago. Pontos de vida gastos dessa forma s\xF3 podem ser recuperados com descanso."
            }, {
                name: "NEX 40% - Abra\xE7ar a Dor",
                description: "Sempre que sofrer dano n\xE3o paranormal, voc\xEA pode gastar uma rea\xE7\xE3o e 2 PE para reduzir esse dano \xE0 metade."
            }, {
                name: "NEX 65% - Absorver Agonia",
                description: "Sempre que reduz um ou mais inimigos a 0 PV com um ritual, voc\xEA recebe uma quantidade de PE tempor\xE1rios igual ao c\xEDrculo do ritual utilizado. Por exemplo, se ativar esse poder com um ritual de 2\xBA c\xEDrculo, receber\xE1 2 PE."
            }, {
                name: "NEX 99% - Medo Tang\xEDvel",
                description: "Voc\xEA aprende o ritual Medo Tang\xEDvel."
            }]
        }, {
            name: "Graduado",
            description: "Voc\xEA foca seus estudos em se tornar um conjurador vers\xE1til e poderoso, conhecendo mais rituais que os outros ocultistas e sendo capaz de torn\xE1-los mais dif\xEDceis de serem resistidos. Seu objetivo \xE9 desvendar e dominar os segredos do Outro Lado a fundo, custe o que custar",
            abilities: [{
                name: "NEX 10% - Saber Ampliado",
                description: "Voc\xEA aprende um ritual de 1\xBA c\xEDrculo. Toda vez que ganha acesso a um novo c\xEDrculo, aprende um ritual adicional daquele c\xEDrculo. Esses rituais n\xE3o contam no seu limite de rituais."
            }, {
                name: "NEX 40% - Grim\xF3rio Ritual\xEDstico",
                description: "Voc\xEA cria um grim\xF3rio especial, que armazena rituais que sua mente n\xE3o seria capaz de guardar. Voc\xEA aprende uma quantidade de rituais de 1\xBA ou 2\xBA c\xEDrculos igual ao seu Intelecto. Quando ganha acesso a um novo c\xEDrculo, pode incluir um novo ritual desse c\xEDrculo em seu grim\xF3rio. Esses rituais n\xE3o contam em seu limite de rituais conhecidos. Para conjurar um ritual armazenado em seu grim\xF3rio, voc\xEA precisa antes gastar uma a\xE7\xE3o completa folheando o grim\xF3rio e relembrando o ritual. O grim\xF3rio ocupa 1 espa\xE7o em seu invent\xE1rio. Se perd\xEA-lo, voc\xEA pode replic\xE1-lo com duas a\xE7\xF5es de interl\xFAdio."
            }, {
                name: "NEX 65% - Rituais Eficientes",
                description: "A DT para resistir a todos os seus rituais aumenta em +5."
            }, {
                name: "NEX 99% - Conhecendo o Medo",
                description: "Voc\xEA aprende o ritual Conhecendo o Medo."
            }]
        }, {
            name: "Intuitivo",
            description: "Assim como combatentes treinam seus corpos para resistir a traumas f\xEDsicos, voc\xEA preparou sua mente para resistir aos efeitos do Outro Lado. Seu foco e for\xE7a de vontade fazem com que voc\xEA expanda os limites de suas capacidades paranormais.",
            abilities: [{
                name: "NEX 10% - Mente S\xE3",
                description: "Voc\xEA compreende melhor as entidades do Outro Lado, e passa a ser menos abalado por seus efeitos. Voc\xEA recebe resist\xEAncia paranormal +5 (+5 em testes de resist\xEAncia contra efeitos paranormais)."
            }, {
                name: "NEX 40% - Presen\xE7a Poderosa",
                description: "Sua resili\xEAncia mental faz com que voc\xEA possa extrair mais do Outro Lado. Voc\xEA adiciona sua Presen\xE7a ao seu limite de PE por turno, mas apenas para conjurar rituais (n\xE3o para DT)."
            }, {
                name: "NEX 65% - Inabal\xE1vel",
                description: "Voc\xEA recebe resist\xEAncia a dano mental e paranormal 10. Al\xE9m disso, quando \xE9 alvo de um efeito paranormal que permite um teste de Vontade para reduzir o dano \xE0 metade, voc\xEA n\xE3o sofre dano algum se passar."
            }, {
                name: "NEX 99% - Presen\xE7a do Medo",
                description: "Voc\xEA aprende o ritual Presen\xE7a do Medo."
            }]
        }, {
            name: "L\xE2mina Paranormal",
            description: "Alguns ocultistas preferem ficar fechados em suas bibliotecas estudando livros e rituais. Outros preferem investigar fen\xF4menos paranormais em sua fonte. J\xE1 voc\xEA, prefere usar o paranormal como uma arma. Voc\xEA aprendeu e dominou t\xE9cnicas de luta mesclando suas habilidades de conjura\xE7\xE3o com suas capacidades de combate. Apesar do nome, membros dessa trilha podem utilizar tanto armas corpo a corpo quanto de ataque \xE0 dist\xE2ncia.",
            abilities: [{
                name: "NEX 10% - L\xE2mina Maldita",
                description: "Voc\xEA aprende o ritual Amaldi\xE7oar Arma. Se j\xE1 o conhece, seu custo \xE9 reduzido em \u20131 PE. Al\xE9m disso, quando conjura esse ritual, voc\xEA pode usar Ocultismo, em vez de Luta ou Pontaria, para testes de ataque com a arma amaldi\xE7oada."
            }, {
                name: "NEX 40% - Gladiador Paranormal",
                description: "Sempre que acerta um ataque corpo a corpo em um inimigo, voc\xEA recebe 2 PE tempor\xE1rios. Voc\xEA pode ganhar um m\xE1ximo de PE tempor\xE1rios por cena igual ao seu limite de PE. PE tempor\xE1rios desaparecem no final da cena."
            }, {
                name: "NEX 65% - Conjura\xE7\xE3o Marcial",
                description: "Uma vez por rodada, quando voc\xEA lan\xE7a um ritual com execu\xE7\xE3o de uma a\xE7\xE3o padr\xE3o, pode gastar 2 PE para fazer um ataque corpo a corpo como uma a\xE7\xE3o livre."
            }, {
                name: "NEX 99% - L\xE2mina do Medo",
                description: "Voc\xEA aprende o ritual L\xE2mina do Medo."
            }]
        }],
    }
];
// endregion

// region SelectRetual
function addRituaisSelect()
{
    let select = document.getElementsByClassName("selectosimbolo")[0]
    select.innerHTML = "";

    for (const i in rituais) {
        var option = document.createElement("option");
        option.text = rituais[i].name;
        option.value = i;
        select.add(option);
    }
}

function selecionaRitual(id)
{
    let ritual = rituais[id];

    let nome = document.getElementsByName("ritual")[0];
    let elemento = document.getElementsByName("elemento")[0];
    let circulo = document.getElementsByName("circulo")[0];
    let execucao = document.getElementsByName("conjuracao")[0];
    let alcance = document.getElementsByName("alcance")[2]
    let alvo = document.getElementsByName("alvo")[0]
    let duracao = document.getElementsByName("duracao")[0];
    let resistencia = document.getElementsByName("resistencia")[0];
    let normaldice = document.getElementsByName("dano1")[0];
    let discenteDice = document.getElementsByName("dano2")[0];
    let verdadeiroDice = document.getElementsByName("dano3")[0];
    let descricao = document.getElementsByName("efeito")[0];
    let foto = document.getElementsByName("simbolourl")[0];

    nome.value = ritual.name ?? "";
    elemento.value = ritual.element ?? "";
    circulo.value = ritual.circle ?? "";
    execucao.value = ritual.execution ?? "";
    alcance.value = ritual.range ?? "";
    alvo.value = ritual.target ?? "";
    duracao.value = ritual.duration ?? "";
    resistencia.value = ritual.save ?? "";
    normaldice.value = ritual.normalDice ?? "";
    discenteDice.value = ritual.discenteDice ?? "";
    verdadeiroDice.value = ritual.verdadeiroDice ?? "";

    descricao.value = ritual.description ?? "";
    descricao.style.height = "1px";
    descricao.style.height = (25+descricao.scrollHeight)+"px";

    foto.value = "https://fichasop.com/assets/img/desconhecido.webp";
}
// endregion

// region SelectArmas
function addArmasSelect()
{
    let select = document.getElementById("albumfotosarmas");
    select.innerHTML = "";

    for (const i in armas) {
        var option = document.createElement("option");
        option.text = armas[i].name;
        option.value = i;
        select.add(option);
    }
}

function selecionaArma(id)
{
    const nome = document.getElementsByName("nome")[1];
    const tipo = document.getElementsByName("tipo")[0];
    const alcance = document.getElementsByName("alcance")[0];
    const recarga = document.getElementsByName("recarga")[0];
    const especial = document.getElementsByName("especial")[0];
    const ataque = document.getElementsByName("ataque")[0];
    const dano = document.getElementsByName("dano")[0];
    const critico = document.getElementsByName("critico")[0];
    const margem = document.getElementsByName("margem")[0];
    const desc = document.getElementsByName("desc")[0];
    const peso = document.getElementsByName("peso")[0];
    const prestigio = document.getElementsByName("prestigio")[0];
    const imagem = document.getElementById("aarma_input");

    nome.value = armas[id].name ?? "";
    tipo.value = armas[id].damageType ?? "";
    alcance.value = armas[id].range ?? "";
    recarga.value = armas[id].ammunitionName ?? "";
    especial.value = armas[id].name ?? "";
    ataque.value = armas[id].type ?? "";
    dano.value = armas[id].damage ?? "";
    critico.value = armas[id].criticalMult ?? "";
    margem.value = armas[id].criticalRange ?? "";
    desc.value = armas[id].description ?? "";
    peso.value = armas[id].slots ?? "";
    prestigio.value = armas[id].category ?? "";
    imagem.value = armas[id].image ?? "";
    editupdatefoto($('#aarma_input').val(),'#addarma img');
}
// endregion

// region SelectItens
const itens = outros.concat(protecoes, municoes, itensAmaldicoados);
function addItensSelect()
{
    let select = document.getElementById("albumfotositens");
    select.innerHTML = "";

    for (const i in itens) {
        var option = document.createElement("option");
        option.text = itens[i].name;
        option.value = i;
        select.add(option);
    }
}

function selecionaItens(id)
{
    const nome = document.getElementsByName("nome")[3];
    const peso = document.getElementsByName("peso")[2];
    const prestigio = document.getElementsByName("prestigio")[2];
    const descricao = document.getElementsByName("descricao")[0];
    imagem = document.getElementById("fotoiteminput");

    nome.value = (itens[id].name ?? "");
    if ("element" in itens[id]){
        nome.value = (itens[id].name ?? "") + " - " + itens[id].element;
    }
    peso.value = itens[id].slots ?? "";
    prestigio.value = itens[id].category ?? "";
    descricao.value = itens[id].description ?? "";

    if ("defense" in itens[id]){
        descricao.value = "Defesa: " + itens[id].defense + "\n" + (itens[id].description ?? "")
    }

    imagem.value = "";
}
// endregion

// region SelectHabilidades
function addHabilidadesSelect()
{
    var select = document.createElement("select");
    select.className = "form-control fs-6";
    select.id = "selectHabilidades";

    for (const i in habilidades) {
        var option = document.createElement("option");
        option.text = habilidades[i].name;
        option.value = i;
        select.add(option);
    }

    const div = document.getElementsByClassName("modal-body")[20];
    div.insertBefore(select, div.firstChild);
}

function selecionaHabilidades(id)
{
    document.getElementById("addcomopoder").checked = false;

    const nome = document.getElementsByName("hab")[0];
    const descricao = document.getElementsByName("desc")[2];

    nome.value = habilidades[id].name;
    descricao.value = habilidades[id].description;
}
// endregion

// region SelectPoderes
function addPoderesSelect()
{
    var select = document.createElement("select");
    select.className = "form-control fs-6";
    select.id = "selectPoderes";

    for (const i in poderes) {
        var option = document.createElement("option");
        option.text = poderes[i].name;
        option.value = i;
        select.add(option);
    }

    const div = document.getElementsByClassName("modal-body")[20];
    div.insertBefore(select, div.firstChild);
}

function selecionaPoderes(id)
{
    document.getElementById("addcomopoder").checked = true;

    const nome = document.getElementsByName("hab")[0];
    const descricao = document.getElementsByName("desc")[2];

    nome.value = poderes[id].name;
    descricao.value = poderes[id].description;
}
// endregion

function getIdTrilha(id)
{
    for (const i in habilidades[id].paths){
        if (habilidades[id].paths[i].name === trilha)
            return i;
    }
}

function getIdClasse()
{
    for (const i in habilidades){
        if (habilidades[i].name === classe)
            return i;
    }
}

function selecionaClasse()
{
    const classeId = getIdClasse();
    const path = getIdTrilha(classeId);

    habilidades = habilidades[classeId].abilities.concat(habilidades[classeId].paths[path].abilities);
}

function alterarHabilidadePoder()
{
    let check = document.getElementById("addcomopoder").checked;
    if (check) {
        $('#selectHabilidades').hide();
        $('#selectPoderes').show();
    }else {
        $('#selectHabilidades').show();
        $('#selectPoderes').hide();
    }
}

function addHideButton(id)
{
    var button = document.createElement("button");
    button.className = "form-control fs-6";
    button.id = "button"+id;
    button.innerText = "X";
    button.value = id;
    button.onclick = function() { hideCard(this.value); };

    let div = document.getElementById(id).children[0].children[2];

    // Problema do site :(
    if (id === "card_rolar")
        div = document.getElementById(id).children[0].children[0].children[2];

    div.style.display = "flex";
    div.appendChild(button);
}

function hideCard(id)
{
    let div = document.getElementById(id).children[1];

    // Problema do site :(
    if (id == "card_rolar") {
        document.getElementById(id).children[0].style.minHeight = "0px";
        div = document.getElementById(id).children[0].children[1];
    }

    const display = div.style.display;

    if (display == "none")
        div.style.display = "";
    else
        div.style.display = "none";
}

(function() {
    'use strict';

    selecionaClasse();

    $("#simbolourl").hide();
    $("#prevsimbolo").hide();
    document.getElementsByClassName("m-2 text-center")[7].style.display = "none";
    document.getElementsByClassName("input-group")[11].style.display = "none";
    document.getElementsByClassName("col-12 col-md-6")[0].className = "col-12";

    addRituaisSelect();
    addArmasSelect();
    addItensSelect();
    addHabilidadesSelect();
    addPoderesSelect();
    alterarHabilidadePoder();

    addHideButton("card_dados")
    addHideButton("card_principal")
    addHideButton("card_atributos")
    addHideButton("card_pericias")
    addHideButton("card_habilidades")
    addHideButton("card_proficiencias")
    addHideButton("card_rolar")
    addHideButton("card_personagem")
    addHideButton("card_inventario")
    addHideButton("card_rituais")

    $(document).ready(function () {
        $(document).on('change', '#addritual .selectosimbolo', function () {
            let id = $('#addritual .selectosimbolo').val()
            selecionaRitual(id);
        });

        $(document).on('change', '#albumfotosarmas', function () {
            let id = $('#albumfotosarmas').val()
            selecionaArma(id);
        });

        $(document).on('change', '#albumfotositens', function () {
            let id = $('#albumfotositens').val()
            selecionaItens(id);
        });

        $(document).on('change', '#selectHabilidades', function () {
            let id = $('#selectHabilidades').val()
            selecionaHabilidades(id);
        });

        $(document).on('change', '#selectPoderes', function () {
            let id = $('#selectPoderes').val()
            selecionaPoderes(id);
        });

        $(document).on('change', '#addcomopoder', function () {
            alterarHabilidadePoder();
        });
    })
})();