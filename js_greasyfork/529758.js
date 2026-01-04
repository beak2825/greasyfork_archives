// ==UserScript==
// @name         Termo Helper (Dicio)
// @namespace    http://tampermonkey.net/
// @version      2025-03-13
// @description  Helper que usa a pesquisa do Dicio e um algoritmo para encontrar as melhores palavras.
// @author       jackiechan285
// @match        https://term.ooo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=term.ooo
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529758/Termo%20Helper%20%28Dicio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529758/Termo%20Helper%20%28Dicio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ------------------ Settings Object ------------------ */
    const settings = {
        // List style: 'floating' or 'docked'
        listStyle: 'docked',
        // Options for word case: 'uppercase', 'sentence', 'lowercase'
        wordCase: 'uppercase',
        // Bold text in the list (true/false)
        boldText: true,
        // How to handle invalid words:
        // Options: 'show' (display normally), 'hide' (do not show), 'highlight' (show in grey)
        invalidWords: 'highlight',
        // Custom title (for floating mode). Use "{boardNumber}" as a placeholder.
        customTitle: 'Help - Board {boardNumber}',
        // Options for score display:
        // 'show' => show score with two decimals, 'integer' => show rounded integer, 'hide' => do not show score.
        showScore: 'integer',
        // Divider: whether to show a divider between list items (only applies to docked mode)
        showDivider: true,
        // When true, localStorage updates trigger re-adding (updating) of the help menus.
        updateLists: true,
        // When true (in docked mode), close the help menu instead of updating when the board updates.
        closeOnSend: false,
        // New setting: when enabled, show only words that are present in the game (from a predefined list)
        onlyGameWords: true
    };

    /* ------------------ Predefined Game Word List ------------------ */
    // Adjust this list to include the words that are in your game.
    const predefinedGameWords = [ "termo", "suíte", "ávido", "festa", "bebia", "honra", "ouvir", "pesco", "fungo", "pagam", "ginga", "pinta", "poder", "útero", "pilha", "sarar", "fruta", "piano", "notar", "musgo", "tensa", "melão", "feliz", "miojo", "pagos", "texto", "mamãe", "ameno", "chuva", "coral", "forte", "tonta", "temor", "ligar", "rolar", "navio", "limbo", "calvo", "fedor", "balde", "oxalá", "talco", "lábia", "crime", "grade", "carta", "flora", "comum", "fatal", "pecar", "feroz", "vírus", "armar", "couro", "êxito", "ecoar", "balão", "falir", "tecer", "arena", "justo", "árido", "ruiva", "múmia", "fogão", "dupla", "touca", "sogro", "ósseo", "treta", "átomo", "sadio", "cólon", "pátio", "molas", "certo", "risco", "bossa", "porre", "tigre", "vocal", "treze", "sueco", "verbo", "latim", "povos", "longo", "lotar", "depor", "cento", "trava", "latão", "ditos", "tórax", "polir", "cacos", "túnel", "lindo", "pegar", "pilar", "passo", "piada", "puxar", "taças", "manta", "barba", "subir", "tosse", "adega", "veias", "mesma", "mirim", "mansa", "nobre", "grama", "ritmo", "samba", "ardor", "daqui", "bravo", "surfe", "tanto", "imune", "lucro", "finos", "bocas", "toldo", "major", "cabos", "estar", "focal", "ações", "queda", "juros", "elite", "burro", "fundo", "duelo", "breve", "bolso", "linha", "parir", "furar", "quina", "pasta", "suíno", "dosar", "cervo", "sujar", "corda", "macia", "reler", "musas", "verme", "focar", "maçãs", "noção", "anual", "aérea", "cerco", "sócio", "porca", "fraco", "punho", "acima", "varão", "bolha", "tanga", "globo", "rampa", "goela", "reais", "cheio", "fosso", "pouco", "danos", "salas", "mimar", "sanha", "óxido", "suave", "época", "antro", "total", "jóias", "polvo", "jejum", "atriz", "recuo", "ágeis", "trenó", "fluir", "muito", "ópera", "ficar", "bucha", "magro", "frota", "série", "ácido", "ápice", "líder", "idoso", "multa", "primo", "garça", "banal", "juíza", "jorro", "sismo", "mercê", "pônei", "etapa", "modas", "colar", "muita", "papel", "ruela", "meias", "gripe", "causa", "menor", "nulos", "caule", "rubor", "optar", "redor", "nação", "galho", "roubo", "parto", "cenas", "pódio", "lesar", "telão", "reúso", "odiar", "usual", "latir", "altos", "livre", "vosso", "geada", "etnia", "trevo", "rezar", "bucal", "vetor", "filho", "miolo", "ordem", "valor", "filha", "antes", "vetar", "surra", "prata", "ceder", "pirão", "frear", "quilo", "rombo", "lomba", "praia", "urnas", "aveia", "picar", "arcar", "única", "mágoa", "jaula", "gerar", "trena", "gemer", "riste", "lábio", "busto", "visar", "velha", "aéreo", "adaga", "crase", "feras", "missa", "cobra", "idéia", "briga", "dardo", "berço", "palmo", "ralar", "reles", "blusa", "super", "grata", "longa", "tarso", "vulto", "lenda", "grego", "pinos", "flúor", "obeso", "sauna", "assim", "troco", "úteis", "infra", "pudor", "cofre", "prece", "junho", "manco", "pisar", "posse", "copas", "ninfa", "gruta", "regra", "citar", "mural", "gíria", "ruína", "fases", "faraó", "míope", "mando", "frios", "gelar", "chave", "sobra", "opaco", "lagos", "corpo", "doses", "basco", "caída", "vinda", "sujos", "igual", "lápis", "julho", "acaso", "dados", "favor", "pente", "beata", "chulo", "rumos", "cubos", "tento", "toque", "polpa", "ombro", "raras", "pneus", "canil", "funil", "perto", "coala", "amplo", "orgia", "doces", "sobre", "tédio", "pinça", "motel", "trufa", "voraz", "azedo", "coeso", "ácaro", "calmo", "enfim", "mitos", "feios", "palha", "andar", "crepe", "pingo", "avelã", "malte", "saída", "monge", "salto", "lótus", "rímel", "lauda", "damas", "sadia", "truco", "sério", "oeste", "selva", "reter", "bolsa", "anexo", "renda", "lobos", "vício", "zebra", "modos", "praxe", "pudim", "birra", "praça", "pedra", "olhar", "pizza", "banho", "bucho", "afins", "maior", "cabra", "visão", "irado", "razão", "macio", "troca", "salmo", "casta", "mídia", "trupe", "morna", "falso", "lidar", "afeto", "verso", "belos", "páreo", "vídeo", "denso", "herói", "moeda", "vaiar", "cópia", "coçar", "aulas", "ganho", "chapa", "jarra", "velho", "grilo", "sigma", "farsa", "sigla", "clone", "cesta", "anjos", "rugir", "luzes", "árdua", "parvo", "censo", "virar", "apito", "gosto", "casto", "fraca", "agudo", "sovar", "fatos", "torso", "tumba", "veste", "leões", "secar", "berro", "sutis", "bispo", "loção", "pesar", "digno", "bamba", "broca", "hiato", "clube", "totem", "prumo", "meios", "vulgo", "esqui", "épico", "minha", "ainda", "remar", "manso", "ousar", "viral", "óvulo", "trote", "artes", "facas", "brava", "meiga", "campo", "levar", "preta", "lebre", "pobre", "gesso", "sabiá", "freio", "marte", "clara", "magos", "reino", "murro", "calar", "prosa", "feita", "folga", "terço", "patas", "vogal", "zíper", "divas", "borda", "penar", "errar", "névoa", "morto", "forma", "áureo", "vapor", "circo", "faixa", "beijo", "bufão", "pedir", "tropa", "vital", "vento", "cárie", "vespa", "negro", "pardo", "local", "beato", "quais", "frase", "sucos", "botão", "balsa", "foice", "nozes", "dente", "cedro", "aceno", "repor", "leque", "drama", "forno", "tarde", "sarro", "certa", "trama", "milho", "dreno", "carma", "poeta", "máfia", "lenço", "nunca", "ficha", "ótica", "molho", "barão", "cútis", "toada", "trens", "chalé", "ciclo", "leigo", "golpe", "haver", "varal", "ritos", "fibra", "nervo", "irmãs", "sagaz", "gente", "pombo", "zinco", "pavor", "feixe", "pular", "titia", "deter", "axila", "brejo", "rever", "naipe", "arder", "então", "pleno", "parma", "juízo", "noite", "seiva", "furor", "janta", "mover", "vidro", "votar", "brasa", "areal", "jarro", "poços", "ninja", "nossa", "boiar", "outra", "pires", "regar", "boato", "sumir", "lenta", "loira", "cinza", "fisco", "agora", "lazer", "pista", "pulga", "fosca", "males", "conto", "tocha", "retas", "cuspe", "persa", "gêmeo", "tenda", "águia", "meros", "robôs", "lados", "areia", "impor", "vigor", "médio", "matiz", "órgão", "senso", "novas", "turco", "densa", "balas", "bicho", "galão", "atual", "monte", "tribo", "tarda", "baita", "ampla", "floco", "banjo", "olhos", "gasto", "fácil", "acesa", "torto", "horta", "alçar", "vivos", "gaita", "solto", "cetro", "redes", "criar", "sacro", "banir", "prato", "gorro", "miúdo", "moída", "aliar", "bater", "fauna", "norte", "haste", "alado", "bloco", "pinga", "ético", "corja", "morno", "ideal", "fusão", "verão", "vozes", "bílis", "ímpar", "sogra", "jovem", "testa", "metal", "falsa", "bruto", "tenso", "dique", "fator", "sutil", "grupo", "matar", "motor", "meses", "vazio", "cujos", "parda", "carpa", "árabe", "plebe", "advir", "punir", "rival", "trave", "tricô", "lento", "sarda", "gozar", "caber", "sexta", "sacra", "rolha", "açude", "casos", "cisão", "chata", "ossos", "expor", "venda", "casco", "banco", "bomba", "sinal", "horto", "ramos", "fonte", "leito", "cobre", "tíbia", "cinco", "noiva", "ponto", "aluno", "traje", "canal", "rouco", "boate", "mútuo", "caros", "lente", "lares", "sacar", "porém", "feudo", "vezes", "carga", "invés", "presa", "geral", "negar", "atuar", "ciúme", "fiado", "força", "corvo", "gordo", "tutor", "duros", "exame", "caldo", "cupim", "ótimo", "mamar", "índio", "autos", "pavio", "fobia", "jeito", "votos", "tesão", "lagoa", "pampa", "diodo", "parte", "ambas", "farda", "sonar", "bacon", "gatas", "banca", "meigo", "pavão", "fixos", "doido", "valer", "girar", "fofas", "caspa", "opção", "macro", "prego", "perda", "enjoo", "longe", "ícone", "ferro", "braço", "unida", "lição", "roçar", "bambu", "dorso", "moral", "ameba", "viril", "amora", "magna", "rural", "penal", "abuso", "sunga", "poção", "erros", "surda", "beber", "cifra", "móvel", "atrás", "farol", "fugaz", "zerar", "menta", "estes", "vênus", "vista", "final", "nevar", "norma", "leste", "nudez", "telas", "tinto", "saber", "bingo", "cacau", "fardo", "morar", "bioma", "domar", "grega", "coice", "ervas", "medir", "mista", "atroz", "raios", "tosar", "muros", "santa", "desde", "posto", "cesto", "abril", "penta", "celta", "mudar", "cacho", "bando", "caixa", "resto", "libra", "régua", "calda", "preto", "tênue", "vazar", "reger", "usina", "vazia", "todos", "durar", "rimar", "angra", "selos", "aliás", "preço", "bufar", "nuvem", "ética", "lapso", "união", "civis", "grito", "bônus", "cinto", "matos", "safra", "algoz", "letra", "dogma", "pesca", "linho", "tchau", "graxa", "casal", "lidos", "zonas", "lorde", "larva", "gnomo", "casca", "botar", "tinta", "prado", "ânimo", "bacia", "magia", "saque", "grato", "bares", "rolos", "loura", "óbvio", "viola", "linda", "sábio", "cueca", "santo", "couve", "susto", "ostra", "altar", "fúria", "limpo", "trair", "ídolo", "deusa", "usura", "caçar", "todas", "obter", "tampa", "fossa", "lavar", "gueto", "lunar", "panda", "vácuo", "rigor", "humor", "pulso", "terno", "anéis", "donos", "coxão", "civil", "bocal", "aroma", "soldo", "morro", "coxas", "cupom", "jogos", "furos", "arcos", "louca", "peste", "crise", "homem", "duplo", "táxis", "pauta", "canja", "cauda", "dizer", "rapaz", "atlas", "jogar", "sítio", "guiar", "babar", "trono", "trigo", "novos", "massa", "horas", "junto", "ômega", "salsa", "pinho", "brisa", "ambos", "guria", "brega", "motim", "rumor", "sutiã", "ducha", "misto", "farto", "pólen", "débil", "dicas", "canto", "cargo", "seita", "graus", "baile", "zelar", "apelo", "arroz", "canoa", "perna", "tarja", "vasos", "fluxo", "falar", "dobro", "órfão", "leite", "curso", "comer", "cisne", "fêmea", "cheia", "lugar", "prazo", "letal", "seção", "fiapo", "vinte", "puxão", "revés", "clipe", "tomar", "manto", "gesto", "praga", "áudio", "ânsia", "tripé", "licor", "álibi", "inato", "lance", "rédea", "mútua", "vagão", "lesma", "beira", "abono", "salão", "russo", "caqui", "pelos", "servo", "facão", "barro", "filme", "rouca", "nisto", "corar", "idade", "lisos", "selim", "peixe", "untar", "sanar", "grana", "panos", "relva", "plena", "besta", "banda", "sódio", "feira", "pompa", "veloz", "belas", "poema", "tecla", "adeus", "dobra", "fruto", "sorte", "sabão", "sushi", "quibe", "corno", "tênis", "tosco", "valsa", "lacre", "fosco", "neném", "clero", "dever", "dúzia", "ração", "terça", "sótão", "fuzuê", "aviso", "prole", "costa", "manga", "metro", "pirar", "verde", "único", "vacas", "suado", "fixar", "loiro", "fogos", "dunas", "radar", "baixa", "frevo", "terra", "calva", "harpa", "dueto", "prova", "pluma", "irmão", "justa", "pagar", "farpa", "cerca", "vôlei", "rosca", "euros", "curar", "fenda", "farra", "áreas", "unhas", "nomes", "tábua", "gosma", "capuz", "ileso", "lenha", "perua", "padre", "fazer", "tocar", "bruxo", "lojas", "lerdo", "nisso", "golfo", "topar", "usada", "ruivo", "saúde", "nadar", "lixar", "vidas", "pomba", "êxodo", "acolá", "dotar", "raiar", "batom", "ontem", "torpe", "oásis", "cloro", "curva", "surto", "ricos", "ursos", "hiena", "vasta", "risos", "febre", "fumar", "fórum", "lutar", "catar", "trela", "litro", "surdo", "menos", "choro", "chefe", "vasto", "cetim", "traço", "cílio", "extra", "greve", "tapar", "tufão", "sarau", "rosas", "touro", "trapo", "lírio", "abano", "delta", "cação", "anzol", "sarna", "clave", "refém", "hífen", "claro", "nasal", "burra", "conde", "ponte", "ondas", "quota", "mexer", "verba", "aonde", "obras", "idosa", "signo", "frias", "lesão", "mundo", "gênio", "legal", "tempo", "âmbar", "culta", "vinho", "livro", "ninho", "germe", "culto", "pasto", "podre", "mirar", "teses", "ébrio", "naves", "afago", "laudo", "ditar", "selar", "garra", "folia", "pedal", "ninar", "tirar", "fugir", "calor", "naval", "porta", "âmago", "ponta", "calma", "capaz", "genro", "almas", "feias", "senão", "barco", "zonzo", "senha", "focos", "óssea", "rosto", "socar", "carne", "garfo", "luvas", "chiar", "vazão", "porco", "gases", "úmido", "boina", "laços", "ferir", "média", "roupa", "duque", "bonde", "tiros", "avaro", "exato", "dócil", "basta", "viver", "placa", "disso", "poros", "arame", "outro", "sopas", "ótima", "bruxa", "raiva", "museu", "astro", "rente", "lombo", "bordo", "cinta", "manhã", "palco", "peões", "folha", "treco", "casar", "louco", "turvo", "rádio", "tipos", "somar", "achar", "macho", "ajuda", "times", "meter", "graça", "mosca", "milha", "carro", "algum", "conta", "nicho", "sabor", "natal", "tátil", "cerne", "torta", "apoio", "símio", "fetal", "hotel", "setor", "vesgo", "amada", "firma", "hábil", "calça", "aspas", "latas", "quase", "creme", "telha", "teias", "assar", "lousa", "baque", "rubro", "fotos", "adiar", "dólar", "polar", "limão", "lança", "coroa", "pomar", "tripa", "mesmo", "jegue", "álbum", "custo", "fútil", "laico", "dedos", "ganso", "visor", "abrir", "dedão", "bazar", "gerir", "mania", "rodar", "turno", "anões", "sexto", "palma", "parco", "pouso", "moela", "ótico", "áries", "tenor", "amido", "solar", "poste", "urubu", "coisa", "seara", "xampu", "dieta", "rocha", "turma", "paiol", "vilão", "nível", "pouca", "vinil", "frade", "tonto", "cavar", "lilás", "nariz", "torre", "parar", "supor", "gambá", "cravo", "árduo", "tosca", "clima", "sósia", "chato", "moita", "vagar", "pausa", "truta", "podar", "fuçar", "posar", "autor", "cruel", "quiçá", "avião", "retro", "dores", "credo", "hinos", "capim", "tango", "vocês", "jurar"
].map(word => normalizeLetter(word));

    /* ------------------ Determine Game Type & LocalStorage Key ------------------ */
    let boardCount = 1;
    if (window.location.pathname.includes('/2/')) {
        boardCount = 2;
    } else if (window.location.pathname.includes('/4/')) {
        boardCount = 4;
    }
    let localStorageKey;
    if (boardCount === 1) {
        localStorageKey = 'termo';
    } else if (boardCount === 2) {
        localStorageKey = 'duo';
    } else if (boardCount === 4) {
        localStorageKey = 'quatro';
    }

    /* ------------------ Global Tracking of Help Menus ------------------ */
    // Tracks which boards have help enabled.
    const helpEnabledBoards = {};

    /* ------------------ Frequency & Sorting ------------------ */
    const letterFrequency = {
        a: 14.63, e: 12.57, o: 10.73, i: 6.18, s: 6.18, r: 4.99,
        d: 4.99, m: 4.21, u: 4.05, t: 3.64, c: 3.18, l: 2.78,
        p: 2.52, v: 1.67, g: 1.30, q: 1.20, f: 1.00, b: 1.00,
        h: 0.70, j: 0.40, x: 0.21, z: 0.01, k: 0.00, w: 0.00
    };

    function normalizeLetter(letter) {
        return letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function cumulativeFrequency(word) {
        return word.split('').reduce((acc, letter) => {
            const norm = normalizeLetter(letter);
            return acc + (letterFrequency[norm] || 0);
        }, 0);
    }

    function orderWordsByScore(words) {
        let colunas = Array.from({ length: 5 }, () => []);
        words.forEach(palavra => {
            for (let i = 0; i < palavra.length; i++) {
                colunas[i].push(palavra[i]);
            }
        });
        let ocorrenciasColunas = colunas.map(coluna => {
            let contador = {};
            coluna.forEach(letra => {
                contador[letra] = (contador[letra] || 0) + 1;
            });
            return contador;
        });
        function pontuacao(palavra) {
            let score = 0;
            for (let i = 0; i < palavra.length; i++) {
                let coluna = ocorrenciasColunas[i];
                let letraMaisComum = Object.keys(coluna).reduce((a, b) => coluna[a] > coluna[b] ? a : b);
                if (palavra[i] === letraMaisComum) {
                    score++;
                }
            }
            return score;
        }
        let palavrasPontuadas = words.map(palavra => {
            let mainScore = pontuacao(palavra);
            let cfScore = cumulativeFrequency(palavra);
            let finalScore = mainScore * 100 + cfScore;
            return {
                word: palavra,
                score: finalScore,
                mainScore,
                cfScore
            };
        });
        palavrasPontuadas.sort((a, b) => b.score - a.score);
        return palavrasPontuadas;
    }

    /* ------------------ Card CSS (Injected inside each card) ------------------ */
    const cardStyles = `
        /* Floating mode styles */
        .word-list-card {
            display: flex;
            flex-direction: column;
            position: absolute;
            background: #2c2c2c;
            color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            width: 250px;
            z-index: 10000;
            font-family: sans-serif;
        }
        .word-list-card header {
            background: #1a1a1a;
            padding: 8px 12px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .word-list-card header .dismiss-btn {
            cursor: pointer;
            padding: 0 4px;
            font-size: 16px;
            line-height: 1;
        }
        .word-list-card .content {
            max-height: 400px;
            overflow-y: auto;
            padding: 8px 12px;
        }
        .word-list-card .content ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .word-list-card .content li {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #444;
            padding: 4px 0;
            font-size: 14px;
        }
        .word-list-card .content li:last-child {
            border-bottom: none;
        }
        /* Scrollbar styles */
        .word-list-card .content::-webkit-scrollbar {
            width: 8px;
        }
        .word-list-card .content::-webkit-scrollbar-thumb {
            background-color: #ffffff57;
            border-radius: 4px;
        }
        .word-list-card .content {
            scrollbar-width: thin;
            scrollbar-color: #ffffff57 transparent;
        }
        .word-list-card .invalid {
            color: #888 !important;
        }
        /* Docked mode styles */
        .word-list-card.docked {
            background: #615458;
            width: 100%;
            box-shadow: none;
            border-radius: 8px;
            position: relative;
        }
        .word-list-card.docked .dock-close-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: #312a2c;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #f0f0f0;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
        }
        .word-list-card.docked:hover .dock-close-btn {
            opacity: 1;
        }
        .word-list-card.docked .content li {
            border-bottom: ${settings.showDivider ? '1px solid #ffffff26' : 'none'};
        }
    `;

    function createCardStyleElement() {
        const styleEl = document.createElement('style');
        styleEl.textContent = cardStyles;
        return styleEl;
    }

    /* ------------------ Loading Spinner CSS ------------------ */
    const spinnerStyles = `
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 2s linear infinite;
        margin: 16px auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }`;
    const spinnerStyleEl = document.createElement('style');
    spinnerStyleEl.textContent = spinnerStyles;
    document.head.appendChild(spinnerStyleEl);

    /* ------------------ Helper: Word Formatting ------------------ */
    function formatWord(word) {
        if (settings.wordCase === 'uppercase') {
            return word.toUpperCase();
        } else if (settings.wordCase === 'sentence') {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return word.toLowerCase();
        }
    }

    /* ------------------ Helper: Draggable Card ------------------ */
    function makeCardDraggable(card, header) {
        let offsetX, offsetY, isDragging = false;
        header.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - card.getBoundingClientRect().left;
            offsetY = e.clientY - card.getBoundingClientRect().top;
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
            e.preventDefault();
        });
        function moveHandler(e) {
            if (!isDragging) return;
            card.style.left = (e.clientX - offsetX) + 'px';
            card.style.top = (e.clientY - offsetY) + 'px';
        }
        function upHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }
    }

    /* ------------------ Helper: Update Docked Card ------------------ */
    function updateDockedCard(boardElem, card) {
        const boardShadow = boardElem.shadowRoot;
        const hold = boardShadow.querySelector("#hold");
        const allRows = hold.querySelectorAll("wc-row");
        let totalRows = parseInt(boardElem.getAttribute("rows")) || 9;
        let filledRows = 0;
        allRows.forEach(row => {
            const rowShadow = row.shadowRoot;
            if (!rowShadow) return;
            const letters = rowShadow.querySelectorAll("div.letter");
            if (letters.length < 5) return;
            let isFilled = true;
            letters.forEach(letter => {
                if (!letter.textContent.trim()) {
                    isFilled = false;
                }
            });
            if (isFilled) filledRows++;
        });
        let remainingRows = totalRows - filledRows - 1;
        if (remainingRows < 1) remainingRows = 1;
        let firstRow = allRows[0];
        let rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 50;
        let gapCount = remainingRows - 1;
        card.style.height = `calc(${remainingRows} * ${rowHeight}px + ${gapCount} * 0.0625em)`;
        allRows.forEach((row, index) => {
            row.style.display = (index > filledRows) ? 'none' : '';
        });
        if (card._observer) {
            card._observer.disconnect();
            card._observer = null;
        }
        let typingRow = allRows[filledRows];
        if (typingRow && typingRow.shadowRoot) {
            const letters = typingRow.shadowRoot.querySelectorAll("div.letter");
            const observer = new MutationObserver(mutations => {
                let changed = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (!mutation.target.classList.contains("empty")) {
                            changed = true;
                        }
                    }
                });
                if (changed) {
                    if (settings.closeOnSend) {
                        card.remove();
                        allRows.forEach((row) => {
                            row.style.display = '';
                        });
                    } else {
                        updateDockedCard(boardElem, card);
                    }
                }
            });
            letters.forEach(letter => {
                observer.observe(letter, { attributes: true, attributeFilter: ["class"] });
            });
            card._observer = observer;
        }
    }

    /* ------------------ UI: Display Help Menu ------------------ */
    // If wordsWithScore equals 'loading', show a spinner.
    function showWordListCard(boardElem, boardIndex, wordsWithScore) {
        const cardId = 'dicio-word-list-card-' + boardIndex;
        if (settings.listStyle === 'floating') {
            let card = document.getElementById(cardId);
            if (!card) {
                card = document.createElement('div');
                card.id = cardId;
                card.className = 'word-list-card';
                card.appendChild(createCardStyleElement());
                let titleText = settings.customTitle.replace("{boardNumber}", boardIndex + 1);
                const header = document.createElement('header');
                header.innerHTML = `<span>${titleText}</span><span class="dismiss-btn" title="Dismiss">✕</span>`;
                card.appendChild(header);
                header.querySelector('.dismiss-btn').addEventListener('click', () => {
                    card.remove();
                    delete helpEnabledBoards[boardIndex];
                });
                makeCardDraggable(card, header);
                const content = document.createElement('div');
                content.className = 'content';
                card.appendChild(content);
                document.body.appendChild(card);
            }
            const content = card.querySelector('.content');
            if (wordsWithScore === 'loading') {
                content.innerHTML = `<div class="loading-spinner"></div>`;
            } else {
                const list = document.createElement('ul');
                // New: if onlyGameWords is enabled, filter the sortedWords to only those that appear in our game list.
                if(settings.onlyGameWords) {
                    wordsWithScore = wordsWithScore.filter(item => predefinedGameWords.includes(normalizeLetter(item.word)));
                }
                wordsWithScore.forEach(item => {
                    if (settings.invalidWords === 'hide' && item.invalid) return;
                    const li = document.createElement('li');
                    let displayWord = formatWord(item.word);
                    let wordSpan = `<span style="${settings.boldText ? 'font-weight:bold;' : ''}">${displayWord}</span>`;
                    let scoreDisplay = '';
                    if (settings.showScore !== 'hide') {
                        scoreDisplay = (settings.showScore === 'integer') ? Math.round(item.score) : item.score.toFixed(2);
                    }
                    li.innerHTML = `<span>${wordSpan}</span><span>${scoreDisplay}</span>`;
                    if (settings.invalidWords === 'highlight' && item.invalid) {
                        li.classList.add('invalid');
                    }
                    list.appendChild(li);
                });
                content.innerHTML = '';
                content.appendChild(list);
            }
            const rect = boardElem.getBoundingClientRect();
            card.style.top = (window.scrollY + rect.top) + 'px';
            card.style.left = (window.scrollX + rect.right + 20) + 'px';
            helpEnabledBoards[boardIndex] = true;
        } else if (settings.listStyle === 'docked') {
            const boardShadow = boardElem.shadowRoot;
            const hold = boardShadow.querySelector("#hold");
            let card = hold.querySelector('#' + cardId);
            if (!card) {
                card = document.createElement('div');
                card.id = cardId;
                card.className = 'word-list-card docked';
                card.appendChild(createCardStyleElement());
                const content = document.createElement('div');
                content.className = 'content';
                card.appendChild(content);
                const closeBtn = document.createElement('div');
                closeBtn.className = 'dock-close-btn';
                closeBtn.innerHTML = '✕';
                closeBtn.title = 'Dismiss';
                closeBtn.addEventListener('click', () => {
                    card.remove();
                    const allRows = hold.querySelectorAll("wc-row");
                    allRows.forEach(row => row.style.display = '');
                    delete helpEnabledBoards[boardIndex];
                });
                card.appendChild(closeBtn);
                hold.appendChild(card);
            }
            if (wordsWithScore === 'loading') {
                card.querySelector('.content').innerHTML = `<div class="loading-spinner"></div>`;
            } else {
                const content = card.querySelector('.content');
                const list = document.createElement('ul');
                if(settings.onlyGameWords) {
                    wordsWithScore = wordsWithScore.filter(item => predefinedGameWords.includes(normalizeLetter(item.word)));
                }
                wordsWithScore.forEach(item => {
                    if (settings.invalidWords === 'hide' && item.invalid) return;
                    const li = document.createElement('li');
                    let displayWord = formatWord(item.word);
                    let wordSpan = `<span style="${settings.boldText ? 'font-weight:bold;' : ''}">${displayWord}</span>`;
                    let scoreDisplay = '';
                    if (settings.showScore !== 'hide') {
                        scoreDisplay = (settings.showScore === 'integer') ? Math.round(item.score) : item.score.toFixed(2);
                    }
                    li.innerHTML = `<span>${wordSpan}</span><span>${scoreDisplay}</span>`;
                    if (settings.invalidWords === 'highlight' && item.invalid) {
                        li.classList.add('invalid');
                    }
                    if (!settings.showDivider) {
                        li.style.borderBottom = 'none';
                    }
                    list.appendChild(li);
                });
                content.innerHTML = '';
                content.appendChild(list);
                updateDockedCard(boardElem, card);
            }
            helpEnabledBoards[boardIndex] = true;
        }
    }

    /* ------------------ Helper: Check for Invalid Words ------------------ */
    function checkInvalid(word, constraints) {
        const lowerWord = word.toLowerCase();
        for (const constraint of constraints) {
            if (normalizeLetter(lowerWord[constraint.pos]) === constraint.letter) {
                return true;
            }
        }
        return false;
    }

    /* ------------------ Process a Given Board ------------------ */
    function processBoard(boardIndex) {
        const boardElem = document.querySelector(`#board${boardIndex}`);
        if (!boardElem) {
            console.error(`Board ${boardIndex + 1} not found!`);
            return;
        }
        const boardShadow = boardElem.shadowRoot;
        if (!boardShadow) {
            console.error(`Board ${boardIndex + 1} has no shadowRoot!`);
            return;
        }
        const hold = boardShadow.querySelector("#hold");
        if (!hold) {
            console.error(`Cannot find #hold container in board ${boardIndex + 1}`);
            return;
        }
        // Immediately show a loading state.
        showWordListCard(boardElem, boardIndex, 'loading');
        let pattern = ['_', '_', '_', '_', '_'];
        const includeSet = new Set();
        const excludeSet = new Set();
        const placeConstraints = [];
        const rows = hold.querySelectorAll("wc-row");
        rows.forEach(row => {
            const rowShadow = row.shadowRoot;
            if (!rowShadow) return;
            const letters = rowShadow.querySelectorAll("div.letter");
            if (letters.length < 5) return;
            letters.forEach((letterDiv, pos) => {
                let letter = letterDiv.textContent.trim();
                if (!letter) return;
                letter = normalizeLetter(letter);
                if (letterDiv.classList.contains("right")) {
                    pattern[pos] = letter;
                    includeSet.add(letter);
                } else if (letterDiv.classList.contains("place")) {
                    includeSet.add(letter);
                    placeConstraints.push({ pos, letter });
                } else if (letterDiv.classList.contains("wrong")) {
                    excludeSet.add(letter);
                }
            });
        });
        includeSet.forEach(letter => {
            if (excludeSet.has(letter)) excludeSet.delete(letter);
        });
        const baseURL = "https://www.dicio.com.br/palavras-com-cinco-letras/";
        const sParam = pattern.join('');
        const iParam = Array.from(includeSet).join(',');
        const eParam = Array.from(excludeSet).join(',');
        const url = `${baseURL}?i=${encodeURIComponent(iParam)}&e=${encodeURIComponent(eParam)}&a=1&s=${encodeURIComponent(sParam)}#resultsTitle`;
        console.log(`Fetching word list for board ${boardIndex + 1} from URL: ${url}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const container = doc.querySelector("#content > div.col-xs-12.col-md-8.card.new-advanced-search-card.mb20");
                    if (!container) {
                        console.error("Container element not found.");
                        return;
                    }
                    let words = [];
                    const paragraphs = container.querySelectorAll("p");
                    paragraphs.forEach(p => {
                        if (p.querySelector("br")) {
                            const html = p.innerHTML;
                            const extracted = html.split(/<br\s*[\/]?>/gi)
                                .map(item => {
                                    const temp = document.createElement('div');
                                    temp.innerHTML = item;
                                    return temp.textContent.trim();
                                })
                                .filter(item => item.length > 0);
                            words = words.concat(extracted);
                        }
                    });
                    let sortedWords = orderWordsByScore(words);
                    sortedWords = sortedWords.map(item => {
                        item.invalid = checkInvalid(item.word, placeConstraints);
                        return item;
                    });
                    console.log(`Sorted words for board ${boardIndex + 1}:`, sortedWords);
                    showWordListCard(boardElem, boardIndex, sortedWords);
                } else {
                    console.error("Failed to fetch Dicio search page:", response.status);
                }
            },
            onerror: function(err) {
                console.error("GM_xmlhttpRequest error:", err);
            }
        });
    }

    /* ------------------ Override localStorage.setItem ------------------ */
    let previousGameState = null;
    try {
        previousGameState = JSON.parse(localStorage.getItem(localStorageKey));
    } catch (e) {
        previousGameState = null;
    }
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === localStorageKey) {
            let newState;
            try {
                newState = JSON.parse(value);
            } catch(e) {
                newState = null;
            }
            if (newState && previousGameState) {
                const oldStates = previousGameState.state || [];
                const newStates = newState.state || [];
                for (let i = 0; i < newStates.length; i++) {
                    if (helpEnabledBoards[i] && newStates[i].curRow > (oldStates[i] ? oldStates[i].curRow : 0)) {
                        console.log(`Board ${i+1} updated (curRow increased). Re-updating help menu.`);
                        if (settings.updateLists) {
                            processBoard(i);
                        }
                    }
                }
            }
            previousGameState = newState;
        }
    };

    /* ------------------ Register Menu Commands ------------------ */
    if (typeof GM_registerMenuCommand !== 'undefined') {
        for (let i = 0; i < boardCount; i++) {
            GM_registerMenuCommand(`Search Board ${i + 1}`, () => {
                helpEnabledBoards[i] = true;
                processBoard(i);
            });
        }
    }
})();
