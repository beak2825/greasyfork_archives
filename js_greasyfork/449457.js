// ==UserScript==
// @name        WaniKani French Kanji Synoynms
// @namespace   wk.french.synonyms
// @version     1.0.0
// @description Automatically adds user synonyms to all your unlocked kanji using french meaning synonyms collected from Jisho.org
// @author      Norman Sue, Updated by Acaretia
// @include     https://www.wanikani.com/
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/kanji
// @copyright   2018+, Norman Sue
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/449457/WaniKani%20French%20Kanji%20Synoynms.user.js
// @updateURL https://update.greasyfork.org/scripts/449457/WaniKani%20French%20Kanji%20Synoynms.meta.js
// ==/UserScript==

window.__wanikani_bulk_add_kanji_user_synonyms = {};

// These synonyms were downloaded from http://nihongo.monash.edu/cgi-bin/wwwjdic
window.__wanikani_bulk_add_kanji_user_synonyms.SYNONYMS = {
  "一": [
    "un",
    "radical un (no. 1)"
  ],
  "二": [
    "deux",
    "radical deux (no. 2)"
  ],
  "七": [
    "sept"
  ],
  "人": [
    "être humain",
    "personne"
  ],
  "八": [
    "huit",
    "radical huit (no. 12)"
  ],
  "力": [
    "force",
    "fort",
    "puissance",
    "tension",
    "tenir le coup",
    "s'efforcer",
    "employer (force)"
  ],
  "十": [
    "dix"
  ],
  "上": [
    "au-dessus",
    "haut",
    "monter",
    "donner (je te donne)"
  ],
  "下": [
    "au-dessous",
    "descendre",
    "bas",
    "donner (vous me donnez)",
    "inférieur"
  ],
  "大": [
    "grand"
  ],
  "女": [
    "femme",
    "féminin"
  ],
  "山": [
    "montagne"
  ],
  "工": [
    "ingénierie",
    "industrie",
    "construction",
    "radical katakana E (no. 48)"
  ],
  "刀": [
    "épée",
    "sabre",
    "couteau"
  ],
  "土": [
    "sol",
    "terre",
    "terrain",
    "Turquie"
  ],
  "夕": [
    "soirée"
  ],
  "小": [
    "petit"
  ],
  "了": [
    "achevé",
    "fini"
  ],
  "又": [
    "ou encore",
    "de plus",
    "d'un autre côté"
  ],
  "丸": [
    "rond",
    "arrondir",
    "entier (mois)",
    "pilule",
    "perfection",
    "suffixe des bateaux",
    "se pelotonner",
    "se rouler en boule",
    "séduire",
    "justifier"
  ],
  "才": [
    "génie",
    "\"(x) ans\" (âge)",
    "shaku cubique (18,04 ml)"
  ],
  "五": [
    "cinq"
  ],
  "中": [
    "dans",
    "dedans",
    "à l'intérieur",
    "milieu",
    "centre",
    "moyenne"
  ],
  "六": [
    "six"
  ],
  "手": [
    "main"
  ],
  "天": [
    "cieux",
    "ciel",
    "impérial"
  ],
  "文": [
    "phrase",
    "littérature",
    "style",
    "art",
    "décoration",
    "figure (de style)",
    "plan",
    "radical littéraire (no. 67)"
  ],
  "月": [
    "lune",
    "mois"
  ],
  "木": [
    "arbre",
    "bois (matière)"
  ],
  "水": [
    "eau"
  ],
  "犬": [
    "chien"
  ],
  "出": [
    "sortir",
    "quitter",
    "présence"
  ],
  "右": [
    "droite"
  ],
  "左": [
    "gauche"
  ],
  "本": [
    "livre",
    "présent",
    "essentiel",
    "origine",
    "principal",
    "réalité",
    "vérité",
    "compteur d'objets allongés"
  ],
  "正": [
    "correct",
    "positif",
    "juste",
    "droit",
    "10**40"
  ],
  "田": [
    "rizière"
  ],
  "目": [
    "oeil",
    "regard",
    "aperçu",
    "numérateur ordinal",
    "expérience",
    "classe",
    "faveur",
    "pièce (Go)"
  ],
  "石": [
    "pierre"
  ],
  "立": [
    "debout"
  ],
  "久": [
    "longtemps",
    "vieille histoire"
  ],
  "元": [
    "commencement",
    "origine",
    "ancien temps"
  ],
  "公": [
    "public",
    "prince",
    "officiel",
    "gouvernemental"
  ],
  "内": [
    "intérieur",
    "dedans",
    "entre",
    "parmi",
    "maison"
  ],
  "分": [
    "portion",
    "minute",
    "section",
    "part",
    "degré",
    "son lot dans la vie",
    "comprendre",
    "savoir",
    "devoir",
    "taux",
    "1%",
    "chances",
    "bu = 1/100 de shaku = 3.03 mm"
  ],
  "午": [
    "midi",
    "signe de la 7ème branche terrestre",
    "signe du Cheval (zodiaque)",
    "11 h à 13 h",
    "Sud (180°)"
  ],
  "友": [
    "ami"
  ],
  "太": [
    "gras",
    "dodu",
    "gros"
  ],
  "引": [
    "tirer",
    "admettre",
    "installer",
    "citation",
    "référence",
    "jouer (musique)",
    "attraper (froid)"
  ],
  "心": [
    "coeur",
    "esprit",
    "radical coeur (no. 61)"
  ],
  "戸": [
    "porte",
    "compteur de maisons",
    "radical porte (no 63)"
  ],
  "牛": [
    "vache"
  ],
  "毛": [
    "pilosité",
    "pelage",
    "cheveux",
    "plumage",
    "duvet"
  ],
  "止": [
    "arrêter",
    "cesser"
  ],
  "冬": [
    "hiver"
  ],
  "北": [
    "nord"
  ],
  "古": [
    "vieux"
  ],
  "台": [
    "piédestal",
    "socle",
    "compteur de voitures ou machines"
  ],
  "市": [
    "marché",
    "ville",
    "cité"
  ],
  "母": [
    "maman",
    "mère"
  ],
  "用": [
    "se servir de",
    "affaires",
    "service",
    "utiliser",
    "employer"
  ],
  "矢": [
    "fléchette",
    "flèche"
  ],
  "世": [
    "génération",
    "monde",
    "société",
    "public"
  ],
  "他": [
    "autre",
    "un autre",
    "les autres"
  ],
  "写": [
    "copie",
    "être photographié",
    "décrire"
  ],
  "去": [
    "parti",
    "passé",
    "quitter",
    "s'écouler",
    "éliminer",
    "divorce"
  ],
  "号": [
    "surnom",
    "numéro",
    "article",
    "titre",
    "pseudonyme",
    "nom",
    "appel"
  ],
  "央": [
    "centre",
    "milieu"
  ],
  "平": [
    "plan(e)",
    "plat",
    "paix"
  ],
  "氷": [
    "glace",
    "glaçon",
    "grêle",
    "geler",
    "congeler"
  ],
  "申": [
    "dire (humble)",
    "s'appeler (humble)",
    "j'ai l'honneur de",
    "signe de la 9ème branche terrestre",
    "signe du Singe (zodiaque)",
    "15 h à 17 h"
  ],
  "皮": [
    "peau",
    "cuir",
    "fourrure",
    "radical peau (no. 107)"
  ],
  "礼": [
    "salut",
    "courbette",
    "cérémonie",
    "remerciements",
    "rémunération"
  ],
  "休": [
    "repos",
    "jour de repos",
    "se coucher",
    "dormir"
  ],
  "先": [
    "avant",
    "devant",
    "précédent",
    "futur",
    "antériorité"
  ],
  "字": [
    "caractère",
    "lettre",
    "mot",
    "hameau"
  ],
  "年": [
    "année",
    "compteur d'années"
  ],
  "早": [
    "tôt",
    "rapide"
  ],
  "気": [
    "esprit",
    "air",
    "atmosphère",
    "humeur"
  ],
  "竹": [
    "bambou"
  ],
  "糸": [
    "fil"
  ],
  "耳": [
    "oreille"
  ],
  "虫": [
    "insecte",
    "vermine",
    "ver",
    "reptile",
    "colère"
  ],
  "村": [
    "village",
    "ville"
  ],
  "男": [
    "homme",
    "mâle"
  ],
  "花": [
    "fleur"
  ],
  "貝": [
    "coquillage"
  ],
  "赤": [
    "rouge"
  ],
  "車": [
    "véhicule",
    "voiture"
  ],
  "不": [
    "négation",
    "non",
    "mauvais",
    "laid",
    "maladroit"
  ],
  "仕": [
    "servir",
    "faire",
    "officiel"
  ],
  "会": [
    "réunion",
    "rencontre",
    "meeting",
    "parti",
    "association",
    "entrevue",
    "rejoindre"
  ],
  "光": [
    "rayon",
    "lumière"
  ],
  "同": [
    "identique",
    "similaire",
    "égal"
  ],
  "回": [
    "tourner",
    "fois",
    "rond",
    "manche (jeu)",
    "tour",
    "révolution",
    "récurrence",
    "compteur de fois"
  ],
  "多": [
    "beaucoup",
    "nombreux",
    "fréquent"
  ],
  "当": [
    "frapper",
    "juste",
    "approprié",
    "lui-même"
  ],
  "毎": [
    "chaque"
  ],
  "池": [
    "étang",
    "mare",
    "réservoir (eau)"
  ],
  "羽": [
    "plume",
    "compteur d'oiseaux, lapins"
  ],
  "肉": [
    "chair",
    "viande"
  ],
  "自": [
    "soi-même"
  ],
  "色": [
    "couleur"
  ],
  "何": [
    "quoi"
  ],
  "体": [
    "corps",
    "substance",
    "objet",
    "réalité",
    "compteur d'images"
  ],
  "作": [
    "fabriquer",
    "produire",
    "construire",
    "préparer"
  ],
  "図": [
    "carte",
    "dessin",
    "plan",
    "inattendu",
    "accidentellement"
  ],
  "声": [
    "voix"
  ],
  "弟": [
    "frère cadet",
    "apprenti",
    "disciple",
    "service déférent aux ainés"
  ],
  "形": [
    "forme",
    "style"
  ],
  "社": [
    "temple shinto",
    "compagnie",
    "firme",
    "bureau",
    "association"
  ],
  "言": [
    "dire"
  ],
  "谷": [
    "vallée"
  ],
  "走": [
    "courir"
  ],
  "里": [
    "hameau",
    "village natal",
    "maison de ses parents",
    "ri (3965 mètres)"
  ],
  "学": [
    "étudier",
    "apprendre",
    "science"
  ],
  "空": [
    "vide",
    "ciel",
    "vacant",
    "creux"
  ],
  "金": [
    "or"
  ],
  "雨": [
    "pluie"
  ],
  "青": [
    "bleu",
    "vert"
  ],
  "草": [
    "herbe",
    "mauvaise herbe",
    "plantes",
    "pâturage",
    "écrire",
    "ébauche"
  ],
  "音": [
    "son",
    "bruit"
  ],
  "化": [
    "transformation",
    "prendre la forme de",
    "maquillage",
    "influence",
    "fantôme",
    "enchanter",
    "tromper",
    "chimie",
    "-isation"
  ],
  "地": [
    "sol",
    "terre"
  ],
  "両": [
    "les deux",
    "2",
    "ryou (ancienne monnaie)",
    "compteur de wagons"
  ],
  "向": [
    "se diriger vers",
    "direction",
    "en face",
    "de l'autre côté",
    "éloigné",
    "confronter",
    "défier",
    "approcher",
    "avoir tendance"
  ],
  "安": [
    "paisible",
    "calme",
    "tranquille",
    "pas cher",
    "reposant",
    "satisfait"
  ],
  "曲": [
    "courber",
    "musique",
    "mélodie",
    "composition",
    "plaisir",
    "injustice",
    "faute",
    "malhonnête",
    "pervers",
    "pencher"
  ],
  "有": [
    "posséder",
    "avoir",
    "être",
    "arriver (se passer)"
  ],
  "死": [
    "mort",
    "mourir"
  ],
  "羊": [
    "mouton"
  ],
  "京": [
    "capitale",
    "10**16"
  ],
  "国": [
    "pays"
  ],
  "夜": [
    "nuit",
    "soirée"
  ],
  "姉": [
    "soeur aînée"
  ],
  "店": [
    "magasin",
    "échoppe"
  ],
  "東": [
    "Est"
  ],
  "歩": [
    "marcher",
    "compteur de pas"
  ],
  "直": [
    "droit devant",
    "directement",
    "honnêteté",
    "franchise",
    "réparer",
    "guérir",
    "tout de suite"
  ],
  "知": [
    "savoir",
    "sagesse"
  ],
  "長": [
    "long",
    "chef"
  ],
  "前": [
    "devant",
    "avant"
  ],
  "南": [
    "sud"
  ],
  "室": [
    "pièce",
    "appartement",
    "chambre",
    "serre",
    "cave"
  ],
  "後": [
    "après",
    "derrière",
    "plus tard"
  ],
  "思": [
    "penser"
  ],
  "星": [
    "étoile",
    "point",
    "marque"
  ],
  "活": [
    "vivant",
    "animé",
    "résurrection",
    "être aidé"
  ],
  "点": [
    "point",
    "note",
    "allumer",
    "virgule (décimales)"
  ],
  "科": [
    "département",
    "section",
    "cours",
    "science"
  ],
  "食": [
    "manger",
    "nourriture"
  ],
  "首": [
    "cou",
    "compteur de chansons ou poèmes"
  ],
  "氏": [
    "nom de famille",
    "nom",
    "clan",
    "Monsieur"
  ],
  "由": [
    "c'est pourquoi",
    "raison",
    "cause",
    "origine",
    "grave"
  ],
  "札": [
    "étiquette",
    "billet de banque",
    "compteur d'obligations",
    "affiche",
    "offre"
  ],
  "民": [
    "peuple",
    "nation",
    "citoyen"
  ],
  "以": [
    "au moyen de",
    "parce que",
    "en vue de",
    "comparé à"
  ],
  "必": [
    "nécessairement",
    "certain",
    "inévitable",
    "invariablement"
  ],
  "未": [
    "non-",
    "encore",
    "pas encore",
    "jusqu'ici",
    "même maintenant",
    "signe de la 8ème branche terrestre",
    "signe du Mouton (zodiaque)",
    "13 à 15 heures"
  ],
  "末": [
    "extrémité",
    "fin",
    "dernier",
    "poudre",
    "avenir",
    "postérité"
  ],
  "校": [
    "école",
    "examen",
    "impression",
    "épreuve",
    "correction"
  ],
  "家": [
    "maison"
  ],
  "弱": [
    "faible",
    "fragile"
  ],
  "時": [
    "temps",
    "heure"
  ],
  "紙": [
    "papier"
  ],
  "記": [
    "inscrire",
    "compte-rendu",
    "narration"
  ],
  "通": [
    "circulation",
    "passer par",
    "avenue",
    "trajet (travail)",
    "compteur de lettres, notes, ..."
  ],
  "高": [
    "haut",
    "élevé",
    "grand",
    "cher"
  ],
  "強": [
    "fort"
  ],
  "理": [
    "logique",
    "principe",
    "raison",
    "justice",
    "vérité"
  ],
  "組": [
    "association",
    "tresse",
    "natte",
    "assembler",
    "construire",
    "unir",
    "coopérer",
    "se débattre avec"
  ],
  "船": [
    "bateau",
    "navire"
  ],
  "週": [
    "semaine"
  ],
  "雪": [
    "neige"
  ],
  "魚": [
    "poisson"
  ],
  "黄": [
    "jaune"
  ],
  "黒": [
    "noir"
  ],
  "支": [
    "soutien",
    "support",
    "branche",
    "filiale",
    "succursale",
    "radical branche (no. 65)"
  ],
  "助": [
    "aider",
    "secourir",
    "assister"
  ],
  "対": [
    "vis-à-vis",
    "en face",
    "régulier",
    "égal",
    "opposition",
    "anti-",
    "comparer"
  ],
  "局": [
    "local",
    "pièce",
    "bureau",
    "affaire",
    "conclusion",
    "dame de cour",
    "dame d'honneur",
    "son appartement à elle"
  ],
  "役": [
    "rôle",
    "fonctions",
    "guerre",
    "campagne",
    "corvée",
    "poste",
    "service"
  ],
  "投": [
    "jeter",
    "mettre au rebut",
    "abandonner",
    "lancer",
    "investir",
    "se lancer dans",
    "vendre à perte"
  ],
  "決": [
    "décider",
    "fixer",
    "se mettre d'accord",
    "arrangement"
  ],
  "身": [
    "individu",
    "personne",
    "situation sociale"
  ],
  "研": [
    "polir",
    "étudier",
    "aiguiser"
  ],
  "馬": [
    "cheval"
  ],
  "森": [
    "forêt",
    "bois"
  ],
  "場": [
    "lieu",
    "place",
    "aire",
    "champ (magnétique)"
  ],
  "番": [
    "tour (de rôle)",
    "numéro dans une série"
  ],
  "答": [
    "solution",
    "réponse"
  ],
  "絵": [
    "image",
    "dessin",
    "peinture",
    "esquisse"
  ],
  "買": [
    "acheter"
  ],
  "道": [
    "voie",
    "route",
    "rue",
    "région",
    "voyage",
    "morale",
    "enseignements"
  ],
  "間": [
    "intervalle",
    "espace"
  ],
  "雲": [
    "nuage"
  ],
  "数": [
    "nombre",
    "compter",
    "destin",
    "loi",
    "chiffres"
  ],
  "楽": [
    "musique",
    "agréable",
    "confort"
  ],
  "話": [
    "parler",
    "histoire"
  ],
  "所": [
    "lieu"
  ],
  "事": [
    "fait",
    "chose",
    "matière",
    "affaire",
    "raison",
    "peut-être"
  ],
  "使": [
    "utiliser"
  ],
  "受": [
    "subir",
    "recevoir",
    "accepter",
    "répondre (téléphone)",
    "prendre",
    "obtenir"
  ],
  "和": [
    "harmonie",
    "style japonais",
    "paix",
    "adoucir",
    "Japon"
  ],
  "始": [
    "commencer",
    "débuter"
  ],
  "定": [
    "déterminé",
    "fixé",
    "établi",
    "décidé"
  ],
  "服": [
    "habillement",
    "admettre",
    "obéir",
    "libérer (renvoi)",
    "avaler (médicament)"
  ],
  "泳": [
    "nager"
  ],
  "苦": [
    "souffrir",
    "peine",
    "affliction",
    "souci",
    "amer",
    "renfrogné"
  ],
  "表": [
    "surface (apparente)",
    "face",
    "tableau",
    "graphique",
    "diagramme"
  ],
  "部": [
    "partie",
    "bureau",
    "service",
    "classe",
    "copie",
    "section",
    "portion",
    "compteur de copies (presse)"
  ],
  "乗": [
    "monter",
    "prendre (train, ...)",
    "embarquer",
    "chevaucher",
    "profiter",
    "multiplication",
    "mentionner",
    "compteur de véhicules",
    "se joindre à"
  ],
  "客": [
    "hôte",
    "client",
    "visiteur"
  ],
  "屋": [
    "toit",
    "maison",
    "échoppe",
    "négociant",
    "vendeur"
  ],
  "度": [
    "degré",
    "occurrence",
    "fois",
    "compteur d'occurrences"
  ],
  "持": [
    "avoir",
    "tenir"
  ],
  "界": [
    "monde"
  ],
  "発": [
    "départ",
    "décharge",
    "dégagement",
    "publier",
    "émettre",
    "partir de",
    "divulguer",
    "compteur de coups de feu"
  ],
  "相": [
    "inter-",
    "mutuel",
    "ensemble",
    "ministre",
    "aspect",
    "phase",
    "physionomie"
  ],
  "県": [
    "préfecture",
    "département"
  ],
  "美": [
    "beauté",
    "beau, belle"
  ],
  "負": [
    "défaite",
    "perdre",
    "moins",
    "négatif",
    "assumer",
    "porter sur le dos",
    "devoir à quelqu'un",
    "faire un rabais"
  ],
  "送": [
    "escorter",
    "envoyer"
  ],
  "重": [
    "lourd",
    "empiler",
    "entasser",
    "s'emboîter",
    "- couches"
  ],
  "談": [
    "discuter",
    "parler"
  ],
  "要": [
    "besoin",
    "point principal",
    "pivot",
    "essentiel",
    "point clef"
  ],
  "勝": [
    "victoire",
    "gagner",
    "l'emporter",
    "surpasser"
  ],
  "起": [
    "se lever",
    "se réveiller",
    "début",
    "se produire",
    "provoquer"
  ],
  "速": [
    "vite",
    "rapide"
  ],
  "配": [
    "distribuer",
    "épouse",
    "exiler",
    "rationner"
  ],
  "酒": [
    "saké",
    "alcool"
  ],
  "院": [
    "temple",
    "institution",
    "résidence",
    "école",
    "hôpital"
  ],
  "終": [
    "finir",
    "fin"
  ],
  "転": [
    "rouler",
    "tourner",
    "changer"
  ],
  "進": [
    "progresser",
    "avancer",
    "promouvoir"
  ],
  "落": [
    "tomber",
    "chute",
    "perdre"
  ],
  "葉": [
    "feuille",
    "lobe",
    "aiguille",
    "brin (herbe)",
    "fragment",
    "compteur d'objets plats"
  ],
  "軽": [
    "léger",
    "insignifiant",
    "sans importance"
  ],
  "運": [
    "porter",
    "chance",
    "destin",
    "destinée",
    "sort",
    "progrès"
  ],
  "開": [
    "ouvrir",
    "s'ouvrir",
    "briser le sceau"
  ],
  "集": [
    "rassembler",
    "réunir",
    "collection",
    "grouiller",
    "attroupement"
  ],
  "飲": [
    "boire",
    "fumer",
    "prendre"
  ],
  "業": [
    "activité",
    "vocation",
    "arts",
    "représentation",
    "karma"
  ],
  "漢": [
    "sino-",
    "Chine"
  ],
  "路": [
    "chemin",
    "route",
    "distance"
  ],
  "農": [
    "agriculture",
    "fermier"
  ],
  "歌": [
    "chanson",
    "chanter"
  ],
  "算": [
    "calculer",
    "prédire",
    "nombre",
    "abaque (boulier)",
    "probabilité"
  ],
  "語": [
    "langage",
    "mot",
    "raconter"
  ],
  "読": [
    "lire"
  ],
  "鳴": [
    "gazouiller",
    "crier",
    "aboyer",
    "pousser son cri (animal)",
    "sonner",
    "écho",
    "cacarder"
  ],
  "横": [
    "latéral",
    "côté",
    "horizontal",
    "largeur",
    "trame (tissu)"
  ],
  "調": [
    "enquête",
    "mélodie",
    "ton (majeur/mineur)",
    "style d'écriture",
    "préparer",
    "exorciser"
  ],
  "頭": [
    "tête",
    "compteur de gros animaux"
  ],
  "顔": [
    "visage",
    "expression"
  ],
  "病": [
    "malade"
  ],
  "最": [
    "le plus",
    "ultra-",
    "extrême"
  ],
  "争": [
    "se quereller",
    "se disputer"
  ],
  "伝": [
    "transmettre",
    "côtoyer",
    "suivre",
    "rapporter",
    "communiquer",
    "légende",
    "tradition"
  ],
  "共": [
    "ensemble",
    "les deux",
    "ni l'un ni l'autre",
    "tous",
    "et",
    "semblable",
    "avec"
  ],
  "好": [
    "aimer bien",
    "apprécié",
    "agréable"
  ],
  "老": [
    "vieillard",
    "âgé",
    "vieillir"
  ],
  "位": [
    "rang",
    "position",
    "grade",
    "trône",
    "couronne",
    "à peu près"
  ],
  "低": [
    "bas",
    "petit (taille)",
    "humble"
  ],
  "別": [
    "séparer",
    "spécialement",
    "diverger",
    "extra",
    "un autre"
  ],
  "利": [
    "profit",
    "avantage",
    "bénéfice"
  ],
  "労": [
    "labeur",
    "remerciement pour",
    "récompense pour",
    "être plein d'attentions",
    "soucis"
  ],
  "命": [
    "destinée",
    "destin",
    "ordre",
    "décret",
    "vie",
    "nommer (à un poste)"
  ],
  "放": [
    "libérer",
    "relâcher",
    "renvoyer",
    "enflammer",
    "bannir",
    "émettre"
  ],
  "波": [
    "onde",
    "vague",
    "Pologne"
  ],
  "注": [
    "verser",
    "se jeter dans",
    "arroser",
    "servir (boisson)",
    "note",
    "remarque",
    "annotation",
    "commentaire"
  ],
  "育": [
    "élever",
    "grandir"
  ],
  "拾": [
    "ramasser",
    "cueillir",
    "trouver",
    "aller à pied",
    "10 (X)"
  ],
  "指": [
    "doigt",
    "désigner",
    "indiquer",
    "jouer (échecs)",
    "mesure (règle, mètre)"
  ],
  "洋": [
    "océan",
    "style occidental"
  ],
  "秒": [
    "seconde"
  ],
  "級": [
    "classe",
    "rang",
    "grade",
    "niveau"
  ],
  "追": [
    "pourchasser",
    "chasser",
    "suivre",
    "poursuivre",
    "pendant ce temps (à suivre)"
  ],
  "戦": [
    "guerre",
    "bataille",
    "match"
  ],
  "競": [
    "compétition",
    "rivaliser",
    "enchère",
    "vente aux enchères",
    "combat",
    "concours",
    "course"
  ],
  "良": [
    "bon",
    "plaisant",
    "habile"
  ],
  "功": [
    "réussite",
    "réalisation",
    "succès",
    "mérite",
    "honneur",
    "crédit"
  ],
  "便": [
    "commodité",
    "courrier",
    "vol (avion)",
    "nouvelles"
  ],
  "働": [
    "travailler",
    "(kokuji)"
  ],
  "令": [
    "ordre",
    "anciennes lois",
    "décret"
  ],
  "味": [
    "goût",
    "saveur"
  ],
  "勉": [
    "exercice"
  ],
  "庭": [
    "jardin",
    "cour"
  ],
  "息": [
    "respirer",
    "fils",
    "intérêts (prêt)"
  ],
  "根": [
    "racine",
    "radical",
    "point noir (acné)"
  ],
  "流": [
    "courant",
    "style",
    "mode",
    "évier",
    "flux",
    "confisquer (un article en gage)"
  ],
  "消": [
    "éteindre",
    "effacer",
    "disparaître",
    "neutraliser",
    "annuler"
  ],
  "倍": [
    "double",
    "deux fois",
    "fois",
    "plier (en 2)"
  ],
  "員": [
    "employé",
    "membre",
    "nombre (de personnes)",
    "personne en charge"
  ],
  "祭": [
    "rituel",
    "fête",
    "prières",
    "célébration",
    "déifier",
    "enchâsser",
    "adoration"
  ],
  "第": [
    "numéro",
    "résidence"
  ],
  "都": [
    "métropole",
    "capitale"
  ],
  "商": [
    "commerce",
    "affaire",
    "vente",
    "distributeur",
    "marchand"
  ],
  "悪": [
    "mauvais",
    "vice",
    "vaurien",
    "faux",
    "mal"
  ],
  "族": [
    "tribu",
    "famille"
  ],
  "深": [
    "profond",
    "augmenter",
    "intensifier",
    "renforcer"
  ],
  "童": [
    "jeune",
    "enfant"
  ],
  "陽": [
    "Yang",
    "soleil",
    "éclat solaire",
    "positif",
    "mâle",
    "paradis",
    "journée"
  ],
  "階": [
    "étage",
    "niveau",
    "compteur d'étages"
  ],
  "悲": [
    "triste",
    "peine",
    "déplorer",
    "regret"
  ],
  "期": [
    "période",
    "temps",
    "date",
    "terme"
  ],
  "植": [
    "planter"
  ],
  "歯": [
    "dent",
    "dentée (roue)",
    "crémaillère (rail)"
  ],
  "温": [
    "chaud"
  ],
  "港": [
    "port"
  ],
  "湯": [
    "eau chaude",
    "bain",
    "source chaude"
  ],
  "登": [
    "monter",
    "escalader"
  ],
  "着": [
    "enfiler",
    "porter (vêtement)",
    "arriver",
    "compteur de vêtements"
  ],
  "短": [
    "court",
    "bref",
    "faute",
    "défaut",
    "point faible"
  ],
  "野": [
    "sauvage",
    "champ",
    "rustique",
    "vie civile"
  ],
  "泉": [
    "source",
    "fontaine"
  ],
  "生": [
    "vie",
    "naissance",
    "authentique",
    "cru"
  ],
  "亡": [
    "décédé",
    "feu ...",
    "mon regretté ...",
    "mourir",
    "périr",
    "détruire"
  ],
  "合": [
    "correspondre",
    "convenir",
    "joindre",
    "go (0,18 l ou 0,33 m)"
  ],
  "風": [
    "vent",
    "air",
    "style",
    "manière"
  ],
  "予": [
    "auparavant",
    "à l'avance",
    "moi",
    "je"
  ],
  "々": [],
  "返": [
    "rendre",
    "répondre",
    "s'estomper",
    "rembourser"
  ],
  "新": [
    "nouveau"
  ],
  "宿": [
    "auberge",
    "logement",
    "séjourner",
    "relais (de poste, station)",
    "porter en soi (virus, enfant)",
    "être enceinte",
    "habiter",
    "habitation"
  ],
  "想": [
    "concept",
    "pensée",
    "idée"
  ],
  "感": [
    "sentiment",
    "émotion",
    "sensation"
  ],
  "整": [
    "mettre en ordre",
    "organiser",
    "arranger",
    "air (mélodie)",
    "ton",
    "mètre",
    "clef (musique)"
  ],
  "暗": [
    "obscurité",
    "disparaître",
    "ombre",
    "informel",
    "s'assombrir",
    "être aveuglé"
  ],
  "様": [
    "Monsieur, Madame",
    "apparence",
    "manière",
    "sorte",
    "état",
    "suffixe de politesse"
  ],
  "橋": [
    "pont"
  ],
  "福": [
    "bénédiction",
    "fortune",
    "chance",
    "richesse"
  ],
  "緑": [
    "vert"
  ],
  "練": [
    "pratiquer",
    "lustrer",
    "s'exercer",
    "s'entraîner",
    "perfectionner",
    "peaufiner"
  ],
  "詩": [
    "poème",
    "poésie"
  ],
  "銀": [
    "argent"
  ],
  "館": [
    "bâtiment",
    "grand bâtiment",
    "résidence",
    "palais"
  ],
  "駅": [
    "gare"
  ],
  "億": [
    "cent millions",
    "10**8"
  ],
  "士": [
    "gentilhomme",
    "samouraï",
    "radical samouraï (no. 33)"
  ],
  "器": [
    "ustensile",
    "récipient",
    "instrument",
    "appareil",
    "capacité",
    "outil",
    "service (de table)"
  ],
  "料": [
    "redevance",
    "recette",
    "frais",
    "prix",
    "matériau"
  ],
  "殺": [
    "tuer",
    "meurtre",
    "massacrer",
    "abattre",
    "trancher",
    "fendre",
    "diminuer",
    "réduire",
    "gâcher"
  ],
  "然": [
    "un certain",
    "si c'est comme ça",
    "dans ce cas",
    "suffixe adverbial"
  ],
  "熱": [
    "chaleur",
    "fièvre",
    "température",
    "manie",
    "passion"
  ],
  "賞": [
    "prix",
    "récompense",
    "louanges"
  ],
  "輪": [
    "roue",
    "anneau",
    "cercle",
    "maillon",
    "boucle",
    "compteur de roues ou fleurs"
  ],
  "鏡": [
    "miroir",
    "-scope",
    "tonneau (saké)",
    "gâteau de riz de Nouvel an"
  ],
  "願": [
    "demande",
    "prière",
    "souhait",
    "voeu",
    "espoir"
  ],
  "養": [
    "nourrir",
    "élever",
    "cultiver",
    "soigner",
    "développer"
  ],
  "情": [
    "sentiments",
    "émotion",
    "passion",
    "compassion",
    "circonstances",
    "faits"
  ],
  "謝": [
    "excuses",
    "remerciements",
    "refus"
  ],
  "映": [
    "projection",
    "refléter",
    "réflexion"
  ],
  "皆": [
    "tout",
    "tous"
  ],
  "例": [
    "exemple",
    "coutume",
    "usage",
    "précédent"
  ],
  "卒": [
    "fin d'études",
    "soldat",
    "privé",
    "mourir"
  ],
  "協": [
    "coopération",
    "co-"
  ],
  "参": [
    "dérouté",
    "déconcerté",
    "trois (III)",
    "aller",
    "venir",
    "visiter",
    "être battu",
    "mourir",
    "follement amoureux"
  ],
  "囲": [
    "entourer",
    "assiéger",
    "enceinte",
    "palissade",
    "encercler",
    "réserve",
    "garder"
  ],
  "固": [
    "solide",
    "durcir",
    "résolu",
    "coaguler",
    "cailler"
  ],
  "季": [
    "saison"
  ],
  "完": [
    "parfait",
    "achèvement",
    "accompli"
  ],
  "希": [
    "espoir",
    "demander",
    "prier",
    "implorer",
    "dilution",
    "Grèce",
    "rare",
    "peu nombreux",
    "phénoménal"
  ],
  "念": [
    "désir",
    "souhait",
    "sens",
    "idée",
    "pensée",
    "sentiment",
    "attention"
  ],
  "望": [
    "ambition",
    "espoir",
    "désir",
    "aspirer à",
    "dominer (vue)",
    "contempler",
    "pleine lune"
  ],
  "材": [
    "matériaux",
    "ingrédients",
    "bois de charpente",
    "bille de bois",
    "bûche",
    "talent"
  ],
  "束": [
    "fagot",
    "gerbe",
    "bouquet",
    "promesse",
    "mettre en liasse",
    "rame (papier)",
    "gouverner",
    "diriger",
    "contrôler"
  ],
  "松": [
    "pin"
  ],
  "残": [
    "reste",
    "solde (compte)"
  ],
  "的": [
    "cible",
    "but",
    "objectif",
    "terminaison d'adjectif"
  ],
  "約": [
    "environ",
    "promettre",
    "abréger",
    "raccourcir"
  ],
  "基": [
    "fondements",
    "radical (chimie)",
    "compteur de machines",
    "fondations"
  ],
  "芸": [
    "art",
    "technique",
    "métier",
    "interprétation",
    "tour",
    "cascade"
  ],
  "性": [
    "sexe",
    "genre",
    "nature",
    "propriétés"
  ],
  "格": [
    "rang",
    "statut",
    "capacité",
    "caractère",
    "cas (loi, grammaire)"
  ],
  "能": [
    "capacité",
    "habileté",
    "talent",
    "adresse"
  ],
  "術": [
    "technique",
    "art",
    "moyens",
    "tour",
    "ressources",
    "magie"
  ],
  "私": [
    "privé",
    "je",
    "moi"
  ],
  "骨": [
    "os",
    "squelette",
    "restes",
    "charpente"
  ],
  "妥": [
    "aimable",
    "calme",
    "pacifique",
    "approprié",
    "compromis"
  ],
  "雰": [
    "atmosphère",
    "ambiance",
    "brouillard"
  ],
  "頑": [
    "opiniâtre",
    "tenace",
    "têtu",
    "obstination",
    "stupide"
  ],
  "寺": [
    "temple bouddhiste"
  ],
  "岩": [
    "rocher",
    "roc",
    "falaise"
  ],
  "帰": [
    "retour à la maison",
    "arriver à",
    "mener à",
    "aboutir à",
    "renvoyer"
  ],
  "春": [
    "printemps"
  ],
  "昼": [
    "journée",
    "midi"
  ],
  "晴": [
    "éclaircir"
  ],
  "秋": [
    "automne"
  ],
  "列": [
    "file",
    "rang",
    "colonne",
    "queue"
  ],
  "区": [
    "circonscription",
    "arrondissement"
  ],
  "坂": [
    "pente",
    "incliner",
    "colline"
  ],
  "信": [
    "foi",
    "vérité",
    "fidélité",
    "confiance",
    "communication"
  ],
  "単": [
    "simple",
    "un",
    "unique",
    "seulement"
  ],
  "司": [
    "directeur",
    "fonctionnaire",
    "bureau administratif",
    "gouverner",
    "administrer"
  ],
  "変": [
    "insolite",
    "étrange",
    "changer"
  ],
  "夫": [
    "mari",
    "homme"
  ],
  "昨": [
    "hier",
    "précédent",
    "~ dernière"
  ],
  "毒": [
    "poison",
    "virus",
    "venin",
    "germe",
    "mal",
    "blessure",
    "méchanceté"
  ],
  "泣": [
    "pleurer",
    "gémir"
  ],
  "浅": [
    "peu profond",
    "superficiel",
    "frivole",
    "misérable",
    "honteux"
  ],
  "紀": [
    "chronique",
    "compte-rendu",
    "narration",
    "histoire",
    "annales",
    "ère géologique"
  ],
  "英": [
    "Angleterre",
    "anglais",
    "fleur éclose",
    "brillant"
  ],
  "飯": [
    "repas",
    "riz bouilli"
  ],
  "築": [
    "bâtir",
    "construire",
    "fabriquer"
  ],
  "晩": [
    "soir",
    "crépuscule"
  ],
  "猫": [
    "chat"
  ],
  "園": [
    "parc",
    "jardin",
    "ferme"
  ],
  "曜": [
    "jour de la semaine"
  ],
  "遠": [
    "loin",
    "distant"
  ],
  "門": [
    "portail",
    "compteur de canons"
  ],
  "係": [
    "chargé de",
    "liaison",
    "devoir",
    "s'occuper de"
  ],
  "品": [
    "marchandise",
    "dignité",
    "raffinement",
    "article",
    "compteur de plats"
  ],
  "守": [
    "garder",
    "protéger",
    "défendre",
    "obéir",
    "respect (des règles)"
  ],
  "急": [
    "urgence",
    "se dépêcher",
    "soudain",
    "raide",
    "abrupt",
    "aigu"
  ],
  "箱": [
    "boîte",
    "coffre",
    "caisse",
    "wagon"
  ],
  "荷": [
    "bagages",
    "balancier",
    "porter (un fardeau)",
    "épauler (fusil)",
    "cargaison",
    "chargement",
    "fret"
  ],
  "面": [
    "masque",
    "face",
    "traits",
    "surface"
  ],
  "喜": [
    "se réjouir",
    "prendre plaisir à"
  ],
  "府": [
    "préfecture urbaine",
    "arrondissement",
    "bureau de gouvernement",
    "corps représentatif",
    "entrepôt"
  ],
  "治": [
    "règne",
    "être en paix",
    "se calmer",
    "maîtriser",
    "réprimer",
    "gouvernement",
    "guérir",
    "réparer",
    "préserver"
  ],
  "浴": [
    "bain",
    "dorer (au soleil)",
    "bénéficier de"
  ],
  "辞": [
    "démission",
    "mot",
    "terme",
    "expression"
  ],
  "関": [
    "relation",
    "barrière",
    "lien",
    "rapport",
    "concerner"
  ],
  "保": [
    "protéger",
    "garantir",
    "garder",
    "préserver",
    "conserver",
    "soutenir"
  ],
  "弁": [
    "éloquence",
    "valve",
    "pétale",
    "tresse",
    "dialecte",
    "discernement",
    "résoudre",
    "distinguer"
  ],
  "政": [
    "politique",
    "gouvernement"
  ],
  "証": [
    "preuve",
    "évidence",
    "certificat"
  ],
  "険": [
    "à pic",
    "escarpé",
    "raide",
    "lieu inaccessible",
    "position imprenable",
    "regard aiguisé"
  ],
  "危": [
    "dangereux",
    "crainte",
    "gêne"
  ],
  "存": [
    "supposer",
    "être conscient de",
    "croire",
    "sentir"
  ],
  "専": [
    "spécialité",
    "exclusivement",
    "principalement",
    "uniquement"
  ],
  "冒": [
    "risque",
    "affronter",
    "braver",
    "défier",
    "dommage",
    "emprunter (un nom)"
  ],
  "冗": [
    "superflu",
    "inutile"
  ],
  "阪": [
    "coteaux",
    "pente"
  ],
  "原": [
    "pré",
    "prairie",
    "champ",
    "original",
    "primitif",
    "toundra",
    "désert (étendue sauvage)"
  ],
  "細": [
    "menu",
    "long et fin",
    "délicat",
    "mince",
    "fluet",
    "étroit"
  ],
  "薬": [
    "médicament",
    "produit chimique",
    "émail",
    "poudre à canon",
    "bénéfice"
  ],
  "側": [
    "côté",
    "pencher",
    "opposer",
    "regretter"
  ],
  "兵": [
    "soldat",
    "simple soldat",
    "troupes",
    "armée",
    "guerre",
    "stratégie",
    "tactique"
  ],
  "堂": [
    "édifice public",
    "temple",
    "salle",
    "hall",
    "grandiose (bâtiment)"
  ],
  "塩": [
    "sel"
  ],
  "席": [
    "siège",
    "natte",
    "occasion",
    "place"
  ],
  "果": [
    "fruit",
    "récompense",
    "remplir (tâche)",
    "achever",
    "compléter",
    "finir",
    "réussir",
    "atteindre un but"
  ],
  "栄": [
    "florissant",
    "prospérité",
    "honneur",
    "gloire",
    "splendeur"
  ],
  "梅": [
    "prune"
  ],
  "無": [
    "néant",
    "rien",
    "ne pas",
    "non",
    "in-",
    "négatif"
  ],
  "結": [
    "nouer",
    "lier",
    "joindre",
    "contrat",
    "attacher",
    "se coiffer",
    "organiser"
  ],
  "因": [
    "cause",
    "facteur",
    "associé à",
    "dépendre de",
    "limité à"
  ],
  "常": [
    "habituel",
    "ordinaire",
    "normal"
  ],
  "非": [
    "in-",
    "non-",
    "négatif",
    "faute",
    "injustice",
    "condamner"
  ],
  "是": [
    "comme il faut",
    "ceci",
    "juste",
    "justice"
  ],
  "渉": [
    "gué",
    "bac",
    "traverser",
    "port"
  ],
  "虚": [
    "vide",
    "impréparation",
    "craquelure",
    "fissure",
    "contre-vérité"
  ],
  "官": [
    "fonctionnaire",
    "gouvernemental"
  ],
  "察": [
    "deviner",
    "présumer",
    "supposer",
    "juger",
    "comprendre"
  ],
  "愛": [
    "amour",
    "affection",
    "favori"
  ],
  "署": [
    "signature",
    "commissariat de police",
    "bureau (administration)",
    "autorités publiques"
  ],
  "警": [
    "réprimander",
    "avertissement",
    "commandement"
  ],
  "恋": [
    "chérir",
    "amour",
    "idylle",
    "languir",
    "manquer"
  ],
  "覚": [
    "mémoriser",
    "se rappeler",
    "perception",
    "sens",
    "réveil",
    "dessoûler"
  ],
  "説": [
    "théorie",
    "rumeur",
    "opinion",
    "thèse"
  ],
  "幻": [
    "chimère",
    "fantôme",
    "fantasme",
    "vision",
    "rêve",
    "illusion",
    "apparition"
  ],
  "訓": [
    "instructions",
    "lecture japonaise",
    "explication",
    "lire"
  ],
  "弓": [
    "arc",
    "archet"
  ],
  "告": [
    "révélation",
    "dire",
    "informer",
    "annoncer"
  ],
  "種": [
    "espèce",
    "classe",
    "sorte",
    "variété",
    "graine"
  ],
  "達": [
    "suffixe pluriel",
    "accompli",
    "atteindre",
    "aboutir"
  ],
  "報": [
    "rapport",
    "information",
    "faire savoir",
    "récompense",
    "rétribution"
  ],
  "等": [
    "et ainsi de suite",
    "etc...",
    "semblable",
    "classe (1ère)",
    "qualité",
    "égal",
    "pluriel (peu respectueux)"
  ],
  "汽": [
    "vapeur"
  ],
  "借": [
    "emprunter",
    "louer"
  ],
  "座": [
    "s'accroupir",
    "s'asseoir",
    "siège",
    "coussin",
    "rassemblement",
    "théâtre",
    "constellation"
  ],
  "忘": [
    "oublier"
  ],
  "胸": [
    "poitrine",
    "seins",
    "coeur",
    "sentiments"
  ],
  "僧": [
    "prêtre bouddhiste",
    "moine"
  ],
  "禅": [
    "Zen",
    "méditation"
  ],
  "験": [
    "vérification",
    "examen",
    "effet"
  ],
  "可": [
    "possible",
    "acceptable",
    "ne doit pas",
    "ne pas, négatif"
  ],
  "許": [
    "autorisation",
    "permettre",
    "seulement"
  ],
  "枚": [
    "feuille de",
    "compteur d'objets plats"
  ],
  "静": [
    "calme"
  ],
  "禁": [
    "interdiction",
    "défense de"
  ],
  "煙": [
    "fumée"
  ],
  "加": [
    "ajouter",
    "addition",
    "augmentation",
    "rejoindre",
    "inclure",
    "Canada"
  ],
  "節": [
    "noeud (vitesse)",
    "instant",
    "saison",
    "période",
    "occasion",
    "vers (poésie)",
    "stance",
    "honneur",
    "jointure",
    "articulation",
    "bosse",
    "air (musique)",
    "mélodie"
  ],
  "減": [
    "diminuer",
    "réduire",
    "décliner",
    "décroître",
    "avoir faim"
  ],
  "順": [
    "obéir",
    "ordre (tour)",
    "juste",
    "docilité",
    "occasion"
  ],
  "布": [
    "linge"
  ],
  "易": [
    "facile",
    "prêt-à-...",
    "simple",
    "voyance",
    "divination",
    "commerce"
  ],
  "財": [
    "propriété",
    "argent",
    "fortune",
    "actifs"
  ],
  "若": [
    "jeune",
    "si",
    "peut-être",
    "ou bien",
    "petit nombre",
    "inexpérimenté",
    "immature"
  ],
  "詞": [
    "partie du discours",
    "mots",
    "poésie"
  ],
  "閥": [
    "clique",
    "lignée",
    "ascendance",
    "faction",
    "clan"
  ],
  "歴": [
    "historique",
    "curriculum",
    "continuation",
    "passage du temps"
  ],
  "舌": [
    "langue",
    "anche",
    "battant (cloche)"
  ],
  "冊": [
    "tome",
    "volume",
    "compteur de livres"
  ],
  "宇": [
    "firmament",
    "cieux",
    "auvent",
    "toit",
    "maison"
  ],
  "忙": [
    "occupé",
    "affairé",
    "agité"
  ],
  "履": [
    "chausser",
    "enfiler",
    "chaussures",
    "bottes",
    "expérience"
  ],
  "団": [
    "groupe",
    "association"
  ],
  "暴": [
    "explosion",
    "rage",
    "agitation",
    "force",
    "violence",
    "cruauté",
    "outrage",
    "dévoiler"
  ],
  "混": [
    "mélanger",
    "confusion"
  ],
  "乱": [
    "tumulte",
    "émeute",
    "troubles",
    "désordre",
    "guerre",
    "confusion"
  ],
  "得": [
    "obtenir",
    "gain",
    "gagner",
    "trouver",
    "acquérir",
    "pouvoir",
    "profit",
    "avantage",
    "bénéfice"
  ],
  "続": [
    "continuer",
    "série",
    "suite"
  ],
  "連": [
    "emmener",
    "se mettre en rang",
    "s'unir",
    "série",
    "parti",
    "bande",
    "clique"
  ],
  "善": [
    "bien",
    "bonté",
    "vertu"
  ],
  "絡": [
    "enlacer",
    "entrelacer",
    "s'enrouler autour",
    "s'empêtrer dans"
  ],
  "比": [
    "comparer",
    "compétition",
    "proportion",
    "Philippines"
  ],
  "災": [
    "désastre",
    "catastrophe",
    "calamité",
    "malheur"
  ],
  "率": [
    "taux",
    "rapport",
    "proportion",
    "%",
    "coefficient",
    "facteur"
  ],
  "飛": [
    "voler",
    "sauter (une page)",
    "répandre"
  ],
  "害": [
    "tort",
    "mal",
    "blessure"
  ],
  "余": [
    "trop",
    "moi-même",
    "surplus",
    "autre",
    "reste"
  ],
  "難": [
    "difficile",
    "impossible",
    "problème",
    "accident",
    "défaut"
  ],
  "妨": [
    "empêcher",
    "gêner",
    "obstruction",
    "déranger",
    "entraver",
    "brouiller (radio)",
    "saboter"
  ],
  "被": [
    "subir",
    "couvrir",
    "voile",
    "ruminer (soucis)",
    "abri",
    "mettre (vêtement)",
    "porter (sur la tête)",
    "être exposé (film)",
    "victime",
    "souffrir"
  ],
  "震": [
    "tremblement",
    "secouer",
    "frémir",
    "frissonner"
  ],
  "尻": [],
  "尾": [
    "queue",
    "bout",
    "compteur de poissons",
    "bas de pente (montagne)"
  ],
  "械": [
    "instrument",
    "machine",
    "entrave"
  ],
  "嫌": [
    "aversion",
    "détester",
    "haïr"
  ],
  "個": [
    "individuel",
    "privé",
    "compteur d'articles",
    "compteur d'unités militaires"
  ],
  "在": [
    "exister",
    "banlieue",
    "situé à"
  ],
  "夢": [
    "rêve",
    "vision",
    "illusion"
  ],
  "産": [
    "production",
    "porter (fruits)",
    "donner naissance",
    "produire",
    "natal",
    "propriété"
  ],
  "倒": [
    "renverser",
    "tomber",
    "s'écrouler",
    "dégringoler",
    "s'effondrer"
  ],
  "臭": [
    "sentir mauvais",
    "malodorant",
    "odeur",
    "saveur",
    "parfum",
    "puer",
    "aspect louche",
    "brillant"
  ],
  "厚": [
    "épais",
    "lourd",
    "cordial",
    "chaleureux",
    "gentil",
    "effronté",
    "éhonté"
  ],
  "議": [
    "délibération",
    "entretien",
    "débat",
    "considération"
  ],
  "罪": [
    "culpabilité",
    "péché",
    "crime",
    "faute",
    "responsabilité",
    "délit"
  ],
  "防": [
    "prévenir (un danger)",
    "défendre",
    "protéger",
    "résister"
  ],
  "穴": [
    "trou",
    "orifice",
    "fente",
    "grotte",
    "tanière"
  ],
  "論": [
    "argumentation",
    "discours"
  ],
  "経": [
    "sûtra",
    "longitude",
    "passer (temps)",
    "expiré",
    "expérimenter",
    "chaîne (tissu)"
  ],
  "笛": [
    "flûte",
    "clarinette",
    "sifflet",
    "pipeau",
    "cornemuse",
    "piccolo"
  ],
  "史": [
    "histoire",
    "chronique"
  ],
  "済": [
    "achever",
    "finir",
    "excusable",
    "s'en sortir sans"
  ],
  "委": [
    "comité",
    "confier à",
    "laisser à",
    "se consacrer",
    "abandonner"
  ],
  "挙": [
    "faire monter",
    "plan",
    "projet",
    "conduite",
    "actions"
  ],
  "判": [
    "jugement",
    "signature",
    "tampon",
    "sceau"
  ],
  "制": [
    "système",
    "règle",
    "loi",
    "régime",
    "contrôle"
  ],
  "務": [
    "tâche",
    "devoir",
    "travail"
  ],
  "総": [
    "général",
    "entier",
    "tout",
    "complet",
    "total"
  ],
  "設": [
    "créer",
    "fonder",
    "établir",
    "préparer"
  ],
  "資": [
    "capital (argent)",
    "fonds",
    "actifs",
    "ressources",
    "données",
    "favorable à",
    "contribuer à"
  ],
  "件": [
    "affaire",
    "cas",
    "matière",
    "article"
  ],
  "派": [
    "faction",
    "groupe",
    "parti",
    "clan",
    "secte",
    "école"
  ],
  "岡": [
    "mont",
    "colline",
    "butte"
  ],
  "素": [
    "élément",
    "principe",
    "nu",
    "découvert"
  ],
  "評": [
    "évaluer",
    "critiquer",
    "commenter"
  ],
  "批": [
    "critique",
    "commentaire"
  ],
  "任": [
    "responsabilité",
    "devoir",
    "terme",
    "confier à",
    "nommer"
  ],
  "検": [
    "examen",
    "inspection"
  ],
  "審": [
    "audition",
    "audience",
    "jugement"
  ],
  "責": [
    "blâmer",
    "condamner",
    "critiquer"
  ],
  "省": [
    "faire le point (introspection)",
    "abréviation",
    "omission",
    "économie",
    "ministère",
    "éliminer"
  ],
  "増": [
    "augmenter",
    "ajouter",
    "accroissement",
    "gain",
    "promouvoir"
  ],
  "税": [
    "taxe",
    "droits"
  ],
  "解": [
    "délier",
    "notes",
    "clé",
    "explication",
    "compréhension",
    "défaire",
    "résoudre",
    "répondre",
    "annuler",
    "absoudre",
    "expliquer",
    "minute"
  ],
  "際": [
    "occasion",
    "côté",
    "accotement",
    "bord",
    "dangereux",
    "aventureux",
    "indécent",
    "temps",
    "quand"
  ],
  "認": [
    "reconnaître",
    "approuver",
    "certifier",
    "distinguer",
    "apprécier",
    "croire"
  ],
  "義": [
    "vertu",
    "justice",
    "moralité",
    "honneur",
    "loyauté",
    "signification"
  ],
  "罰": [
    "punition",
    "châtiment"
  ],
  "誕": [
    "nativité",
    "être né",
    "déclinaison",
    "exagération",
    "être arbitraire"
  ],
  "過": [
    "passer",
    "dépasser",
    "excéder",
    "erreur"
  ],
  "寝": [
    "être couché",
    "dormir",
    "se reposer",
    "lit",
    "invendu"
  ],
  "各": [
    "chacun",
    "chaque"
  ],
  "案": [
    "plan",
    "suggestion",
    "projet (loi)",
    "réflexion",
    "peur",
    "proposition",
    "idée",
    "attente"
  ],
  "置": [
    "placer",
    "poser",
    "déposer",
    "faire à l'avance",
    "laisser derrière",
    "garder",
    "employer",
    "gage"
  ],
  "費": [
    "dépense",
    "coût",
    "dépenser",
    "consommer",
    "gaspiller"
  ],
  "勢": [
    "vigueur",
    "forces",
    "énergie",
    "puissance militaire"
  ],
  "営": [
    "travail",
    "camp",
    "exécuter",
    "construire",
    "diriger"
  ],
  "示": [
    "montrer",
    "indiquer",
    "signaler",
    "exprimer",
    "exposer"
  ],
  "領": [
    "domaine",
    "juridiction",
    "territoire",
    "fief"
  ],
  "策": [
    "moyen",
    "plan",
    "stratégie",
    "politique",
    "projet",
    "mesures"
  ],
  "副": [
    "vice-",
    "copie",
    "duplicata"
  ],
  "観": [
    "perspective",
    "vue",
    "aspect",
    "apparence",
    "condition (état)"
  ],
  "値": [
    "valeur",
    "prix",
    "coût"
  ],
  "吸": [
    "aspirer",
    "absorber",
    "inhaler",
    "siroter"
  ],
  "姿": [
    "silhouette",
    "forme",
    "aspect"
  ],
  "応": [
    "postuler",
    "oui",
    "OK",
    "accepter",
    "combler (satisfaire)",
    "répondre"
  ],
  "提": [
    "proposition",
    "emmener",
    "tenir en main"
  ],
  "状": [
    "état des choses",
    "conditions",
    "circonstances",
    "lettre",
    "forme",
    "apparence"
  ],
  "態": [
    "attitude",
    "condition",
    "état",
    "apparence",
    "forme (d'un verbe)"
  ],
  "賀": [
    "félicitations",
    "joie"
  ],
  "収": [
    "fournir",
    "obtenir",
    "payer",
    "récolter",
    "revenu",
    "réserve"
  ],
  "停": [
    "arrêt",
    "halte"
  ],
  "革": [
    "cuir",
    "peau",
    "fourrure",
    "devenir sérieux",
    "rénovation",
    "réforme"
  ],
  "鬼": [
    "démon",
    "monstre"
  ],
  "規": [
    "norme",
    "mesure"
  ],
  "護": [
    "protection",
    "garde"
  ],
  "割": [
    "briser",
    "diviser",
    "couper",
    "séparer",
    "proportion",
    "pourcentage (10%)"
  ],
  "崎": [
    "promontoire",
    "cap",
    "pointe"
  ],
  "演": [
    "interpréter",
    "représentation",
    "jouer",
    "numéro",
    "réciter",
    "mettre en scène"
  ],
  "律": [
    "rythme",
    "ordonner",
    "loi",
    "régulation",
    "contrôle",
    "jauge"
  ],
  "師": [
    "maître",
    "expert",
    "professeur",
    "exemplaire",
    "modèle",
    "armée",
    "guerre"
  ],
  "看": [
    "regarder attentivement",
    "veiller sur"
  ],
  "準": [
    "demi-",
    "correspondre à",
    "proportionnel à",
    "se conformer à",
    "standard"
  ],
  "則": [
    "règlement",
    "règle",
    "suivre",
    "norme",
    "loi (science, nature)"
  ],
  "導": [
    "directives",
    "mener",
    "guider",
    "conduire"
  ],
  "幹": [
    "tronc d'arbre",
    "pièce principale"
  ],
  "張": [
    "allonger",
    "étirer",
    "étaler",
    "compteur d'arcs et instruments à cordes",
    "monter (tente)"
  ],
  "優": [
    "tendresse",
    "gentillesse",
    "exceller",
    "surpasser",
    "supériorité",
    "acteur"
  ],
  "宅": [
    "domicile",
    "maison",
    "résidence",
    "notre maison",
    "mon mari"
  ],
  "贅": [],
  "現": [
    "le présent",
    "existant",
    "actuel",
    "montrer"
  ],
  "乳": [
    "lait",
    "seins"
  ],
  "城": [
    "château"
  ],
  "秀": [
    "excellence",
    "exceller",
    "beauté",
    "dépasser"
  ],
  "製": [
    "\"fabriqué en\"",
    "fabrication"
  ],
  "担": [
    "se charger de",
    "responsable",
    "porter",
    "soutenir"
  ],
  "輸": [
    "transporter",
    "envoyer",
    "être inférieur (perdre)"
  ],
  "燃": [
    "brûler",
    "flamber"
  ],
  "祝": [
    "célébrer",
    "féliciter"
  ],
  "届": [
    "remettre",
    "livrer",
    "parvenir",
    "arriver",
    "rapport",
    "notification",
    "transmettre"
  ],
  "狭": [
    "étroit",
    "exigu",
    "serré",
    "se contracter"
  ],
  "腕": [
    "bras",
    "aptitude",
    "talent"
  ],
  "触": [
    "contact",
    "toucher",
    "sentir",
    "frapper",
    "proclamer",
    "annoncer",
    "conflit"
  ],
  "載": [
    "charger",
    "embarquer",
    "monter dans",
    "placer",
    "étaler",
    "10**44"
  ],
  "層": [
    "strate",
    "classe sociale",
    "couche",
    "étage"
  ],
  "型": [
    "moule",
    "modèle",
    "type"
  ],
  "庁": [
    "bureau du gouvernement"
  ],
  "視": [
    "inspection",
    "point de vue",
    "voir",
    "regarder"
  ],
  "管": [
    "tuyau",
    "tube",
    "instrument à vent",
    "discours d'ivrogne",
    "gestion"
  ],
  "象": [
    "éléphant",
    "modèle",
    "imiter",
    "image",
    "forme",
    "signe (des temps)",
    "phénomène"
  ],
  "量": [
    "quantité",
    "mesure",
    "poids",
    "étudier (situation)",
    "estimation",
    "conjecture"
  ],
  "境": [
    "frontière",
    "région",
    "environnement"
  ],
  "武": [
    "guerrier",
    "militaire",
    "chevalerie",
    "armes"
  ],
  "質": [
    "substance",
    "matière",
    "qualité",
    "tempérament"
  ],
  "述": [
    "mentionner",
    "déclarer",
    "parler",
    "raconter"
  ],
  "供": [
    "présenter",
    "offrir",
    "soumettre",
    "proposer",
    "accompagner",
    "servir (plat)",
    "pluriel cérémonieux"
  ],
  "展": [
    "développement",
    "déploiement"
  ],
  "販": [
    "commercialisation",
    "vente",
    "commerce"
  ],
  "株": [
    "action boursière",
    "titre",
    "souche (arbre)",
    "compteur de petites plantes"
  ],
  "限": [
    "limite",
    "limiter",
    "restreindre",
    "autant que possible"
  ],
  "与": [
    "donner",
    "conférer",
    "participer à",
    "décerner",
    "fournir",
    "cause",
    "don",
    "don du ciel"
  ],
  "影": [
    "ombre portée",
    "silhouette",
    "fantôme"
  ],
  "渡": [
    "transit",
    "gué",
    "bac",
    "traversée",
    "import",
    "livrer",
    "diamètre",
    "migrer"
  ],
  "響": [
    "résonner",
    "écho",
    "son",
    "sonner",
    "vibrer"
  ],
  "票": [
    "bulletin",
    "vote",
    "ticket",
    "signe"
  ],
  "景": [
    "paysage",
    "vue"
  ],
  "訟": [
    "accusation",
    "poursuites"
  ],
  "抜": [
    "arracher",
    "extraire",
    "chaparder",
    "enlever",
    "omettre",
    "faire une erreur"
  ],
  "候": [
    "climat",
    "temps",
    "saison"
  ],
  "構": [
    "structure",
    "concerné",
    "préoccupé",
    "construire",
    "position"
  ],
  "模": [
    "imitation",
    "copie",
    "maquette",
    "simulation"
  ],
  "捕": [
    "attraper",
    "capturer"
  ],
  "鮮": [
    "frais",
    "vif",
    "clair",
    "brillant",
    "Corée"
  ],
  "属": [
    "faire partie de",
    "genre",
    "fonctionnaire subalterne",
    "affilié à"
  ],
  "慣": [
    "avoir l'habitude",
    "s'accoutumer",
    "coutumes",
    "expérience"
  ],
  "満": [
    "remplir",
    "assez",
    "fier",
    "satisfaire"
  ],
  "肥": [
    "engrais",
    "grossir",
    "fertile",
    "fumier",
    "choyer"
  ],
  "巻": [
    "rouleau",
    "livre",
    "tome",
    "volume",
    "partie",
    "enrouler",
    "envelopper",
    "compteur de textes (manuscrits roulés)"
  ],
  "絞": [
    "étrangler",
    "serrer",
    "tordre"
  ],
  "隠": [
    "dissimuler",
    "cacher",
    "couvrir"
  ],
  "掛": [
    "accrocher",
    "suspendre",
    "dépendre",
    "arriver à",
    "taxe",
    "verser"
  ],
  "居": [
    "se trouver",
    "résider",
    "être",
    "exister",
    "vivre avec"
  ],
  "替": [
    "substituer",
    "remplacer",
    "échanger"
  ],
  "印": [
    "tampon",
    "sceau",
    "impression",
    "empreinte",
    "symbole",
    "emblème",
    "marque",
    "preuve",
    "souvenir",
    "Inde"
  ],
  "造": [
    "créer",
    "fabriquer",
    "structure",
    "physique",
    "maquillage"
  ],
  "復": [
    "retourner",
    "restaurer",
    "reprendre"
  ],
  "往": [
    "aller simple",
    "aller",
    "parer (coup)",
    "voyage",
    "parfois"
  ],
  "較": [
    "contraste",
    "comparer"
  ],
  "筆": [
    "pinceau",
    "écriture"
  ],
  "貯": [
    "économies",
    "épargne",
    "réserve",
    "stocker",
    "porter la moustache"
  ],
  "故": [
    "coïncidence",
    "spécialement",
    "intentionnellement",
    "raison",
    "cause",
    "circonstances",
    "destin",
    "feu ... (défunt)",
    "c'est pour ça que..."
  ],
  "障": [
    "gêne",
    "faire du mal"
  ],
  "従": [
    "accompagner",
    "obéir",
    "se soumettre à",
    "se conformer à",
    "suivre",
    "s'ensuivre",
    "secondaire",
    "accessoire",
    "subordonné"
  ],
  "我": [
    "ego",
    "je",
    "moi",
    "égoïste",
    "notre",
    "soi-même"
  ],
  "激": [
    "violent",
    "s'exciter",
    "enragé",
    "s'énerver",
    "inciter"
  ],
  "励": [
    "encourager",
    "être appliqué",
    "pousser à"
  ],
  "討": [
    "débat",
    "châtier",
    "attaquer",
    "vaincre",
    "conquérir",
    "détruire"
  ],
  "郵": [
    "courrier",
    "relais de poste"
  ],
  "針": [
    "aiguille",
    "épingle",
    "agrafe",
    "dard"
  ],
  "怪": [
    "méfiant",
    "mystère",
    "apparition"
  ],
  "獣": [
    "bête",
    "animal"
  ],
  "菓": [
    "friandise",
    "gâteau",
    "fruit"
  ],
  "河": [
    "rivière",
    "fleuve"
  ],
  "振": [
    "secouer",
    "saupoudrer",
    "remuer",
    "balancer",
    "feindre"
  ],
  "汗": [
    "sueur",
    "transpirer"
  ],
  "再": [
    "encore une fois",
    "deux fois",
    "une deuxième fois"
  ],
  "接": [
    "joindre",
    "toucher",
    "contact",
    "recoller (morceaux)"
  ],
  "独": [
    "célibataire",
    "seul",
    "spontanément",
    "Allemagne"
  ],
  "占": [
    "bonne aventure",
    "divination",
    "prédiction",
    "occuper",
    "tenir",
    "posséder",
    "avoir",
    "prendre"
  ],
  "段": [
    "étape",
    "marche",
    "escalier"
  ],
  "胃": [
    "estomac",
    "ventre",
    "jabot"
  ],
  "痛": [
    "douleur",
    "mal",
    "dommage",
    "contusion, bleu"
  ],
  "退": [
    "retraite",
    "se retirer",
    "démissionner",
    "repousser",
    "exclure",
    "rejeter"
  ],
  "屈": [
    "céder",
    "se courber",
    "fléchir",
    "soumission"
  ],
  "悩": [
    "soucieux",
    "ennuis",
    "peine",
    "détresse",
    "maladie"
  ],
  "暇": [
    "temps libre",
    "repos",
    "loisirs",
    "temps",
    "congé"
  ],
  "織": [
    "tisser",
    "tissu"
  ],
  "迷": [
    "s'égarer",
    "être perplexe",
    "hésiter",
    "perdu",
    "se tromper",
    "illusion"
  ],
  "惑": [
    "égarer",
    "perplexité",
    "séduire"
  ],
  "誘": [
    "inviter",
    "entraîner",
    "tenter",
    "inciter",
    "séduire",
    "charme"
  ],
  "訪": [
    "rendre visite",
    "demander",
    "rechercher",
    "accuser",
    "présenter ses condoléances"
  ],
  "怒": [
    "colère",
    "offenser"
  ],
  "昇": [
    "s'élever"
  ],
  "眠": [
    "dormir",
    "somnolent",
    "mourir"
  ],
  "睡": [
    "ensommeillé",
    "dormir",
    "mourir"
  ],
  "症": [
    "symptôme",
    "maladie"
  ],
  "迫": [
    "pousser",
    "forcer",
    "harceler",
    "imminent",
    "éperonner"
  ],
  "濃": [
    "concentré",
    "non dilué",
    "épais",
    "sombre"
  ],
  "端": [
    "bord",
    "origine",
    "bout",
    "pointe",
    "bordure",
    "rebord",
    "cap"
  ],
  "途": [
    "trajet",
    "route",
    "voie"
  ],
  "康": [
    "tranquille",
    "paisible"
  ],
  "郎": [
    "fils (enfant)",
    "compteur de fils"
  ],
  "給": [
    "salaire",
    "paye",
    "cadeau",
    "allocation",
    "subventions",
    "accorder",
    "conférer à"
  ],
  "巨": [
    "gigantesque",
    "grand",
    "gros"
  ],
  "庫": [
    "entrepôt",
    "stock",
    "magasin"
  ],
  "児": [
    "nouveau-né",
    "enfant",
    "petit d'animal"
  ],
  "冷": [
    "froid",
    "fraîche (bière)",
    "froide (personne)",
    "refroidir"
  ],
  "幼": [
    "enfance",
    "tendre enfance"
  ],
  "稚": [
    "immature",
    "jeunesse"
  ],
  "処": [
    "traiter",
    "se débarrasser",
    "sentence",
    "condamner",
    "agir",
    "se comporter",
    "vierge",
    "lieu"
  ],
  "博": [
    "docteur",
    "ovation",
    "estimé",
    "exposition",
    "foire",
    "gain"
  ],
  "清": [
    "pur",
    "purifier",
    "exorciser",
    "nettoyer",
    "dynastie Mandchoue"
  ],
  "潔": [
    "viril",
    "immaculé",
    "pur",
    "clair",
    "droit",
    "brave"
  ],
  "録": [
    "enregistrer"
  ],
  "隊": [
    "régiment",
    "compagnie",
    "brigade",
    "groupe"
  ],
  "修": [
    "discipline",
    "bien se conduire",
    "étudier",
    "maîtriser"
  ],
  "券": [
    "ticket",
    "coupon"
  ],
  "奇": [
    "étrange",
    "étrangeté",
    "curieux (bizarre)"
  ],
  "妙": [
    "bizarre",
    "surprenant",
    "mystère",
    "merveilleux",
    "excellent",
    "exquis",
    "délicat",
    "charmant"
  ],
  "麗": [
    "charmant",
    "beau",
    "belle",
    "jolie"
  ],
  "微": [
    "ténu",
    "délicat",
    "insignifiant"
  ],
  "益": [
    "bénéfice",
    "gain",
    "profit",
    "avantage"
  ],
  "程": [
    "ampleur",
    "degré",
    "loi",
    "formule",
    "distance",
    "limites",
    "quantité",
    "bientôt"
  ],
  "精": [
    "raffiné",
    "fantôme",
    "féérique",
    "énergie",
    "vitalité",
    "sperme",
    "excellence",
    "pureté",
    "habileté"
  ],
  "絶": [
    "cesser",
    "au-delà",
    "rompre",
    "couper",
    "s'abstenir",
    "interrompre",
    "supprimer"
  ],
  "憲": [
    "constitution",
    "loi"
  ],
  "衆": [
    "foule",
    "grand nombre",
    "multitude",
    "peuple"
  ],
  "傘": [
    "parapluie"
  ],
  "撃": [
    "battre",
    "attaquer",
    "vaincre",
    "conquérir"
  ],
  "攻": [
    "agression",
    "attaque"
  ],
  "監": [
    "surveiller",
    "officiel",
    "bureau administratif",
    "gouverner",
    "administrer"
  ],
  "乾": [
    "sécheresse",
    "sécher",
    "dessécher",
    "vider (verre)",
    "cieux",
    "empereur"
  ],
  "催": [
    "mécène",
    "tenir (un meeting)",
    "donner (un dîner)",
    "prendre en charge"
  ],
  "欧": [
    "Europe"
  ],
  "江": [
    "baie",
    "crique",
    "anse",
    "rivière"
  ],
  "雄": [
    "mâle",
    "masculin",
    "héros",
    "chef",
    "supériorité",
    "excellence"
  ],
  "韓": [
    "Corée"
  ],
  "診": [
    "examiner",
    "diagnostic",
    "bilan de santé",
    "auscultation"
  ],
  "僚": [
    "collègue",
    "compagnon",
    "fonctionnaire"
  ],
  "積": [
    "volume",
    "produit (x*y)",
    "aire",
    "contenu",
    "entasser",
    "empiler",
    "charger",
    "amasser"
  ],
  "督": [
    "superviseur",
    "entraîner",
    "commander",
    "mener",
    "pousser à faire"
  ],
  "臣": [
    "servant",
    "serviteur",
    "sujet"
  ],
  "航": [
    "naviguer",
    "faire voile",
    "croiser (voile)",
    "voler"
  ],
  "寄": [
    "approcher",
    "s'approcher",
    "faire une visite",
    "collecter",
    "rassembler",
    "envoyer",
    "faire suivre"
  ],
  "街": [
    "boulevard",
    "rue",
    "ville"
  ],
  "緊": [
    "tendu",
    "solide",
    "dur",
    "fiable",
    "serré"
  ],
  "娘": [
    "fille"
  ],
  "怖": [
    "effrayant",
    "affreux",
    "épouvantable",
    "faire peur"
  ],
  "恐": [
    "peur",
    "épouvante",
    "crainte"
  ],
  "添": [
    "annexer",
    "accompagner",
    "se marier",
    "joindre",
    "satisfaire",
    "ajouter",
    "garnir",
    "imiter"
  ],
  "猛": [
    "féroce",
    "fulminer",
    "se ruer",
    "devenir furieux",
    "sauvagerie",
    "force"
  ],
  "索": [
    "câble",
    "corde",
    "chercher (index)"
  ],
  "詰": [
    "hermétiquement clos",
    "conserve",
    "coincé",
    "réprimande",
    "blâme"
  ],
  "詳": [
    "détaillé",
    "complet",
    "précis",
    "bien informé"
  ],
  "魅": [
    "fasciner",
    "charmer",
    "ensorceler"
  ],
  "渇": [
    "soif",
    "sécheresse"
  ],
  "系": [
    "lignée",
    "système"
  ],
  "遊": [
    "jouer"
  ],
  "旗": [
    "drapeau",
    "bannière",
    "étendard"
  ],
  "照": [
    "illuminer",
    "briller",
    "comparer",
    "timide"
  ],
  "快": [
    "agréable",
    "gai",
    "plaisant",
    "confortable"
  ],
  "版": [
    "édition",
    "bloc d'impression",
    "plaque d'impression",
    "impression",
    "version"
  ],
  "乏": [
    "insuffisant",
    "limité",
    "indigent"
  ],
  "適": [
    "approprié",
    "occasionnel",
    "rare",
    "qualifié",
    "capable"
  ],
  "延": [
    "prolonger",
    "allonger",
    "étendre"
  ],
  "翌": [
    "suivant",
    "celui d'après"
  ],
  "覧": [
    "lecture",
    "voir",
    "prendre connaissance"
  ],
  "懐": [
    "poche",
    "bourse",
    "sentiments",
    "coeur",
    "apprivoiser",
    "nostalgie",
    "aspirer à",
    "s'attacher à",
    "manquer (personne)",
    "seins"
  ],
  "押": [
    "appuyer",
    "pousser",
    "arrêter",
    "contrôler",
    "soumettre",
    "attacher",
    "saisir",
    "maintenir",
    "sceau",
    "presser",
    "faire en dépit de"
  ],
  "更": [
    "se faire tard",
    "veiller",
    "de plus",
    "bien sûr"
  ],
  "枕": [],
  "漏": [
    "fuite (eau, toit)",
    "s'échapper (gaz)",
    "temps"
  ],
  "購": [
    "acquisition",
    "acheter",
    "souscrire",
    "s'abonner"
  ],
  "越": [
    "doubler",
    "traverser",
    "muter",
    "surpasser",
    "Vietnam"
  ],
  "飾": [
    "décorer",
    "orner",
    "parer",
    "embellir"
  ],
  "背": [
    "stature",
    "taille",
    "dos",
    "arrière",
    "désobéir",
    "défier",
    "revenir sur",
    "se rebeller"
  ],
  "盗": [
    "vol",
    "dérober",
    "chaparder"
  ],
  "融": [
    "dissoudre",
    "fondre"
  ],
  "編": [
    "compilation",
    "tricoter",
    "natte",
    "tresse",
    "éditer",
    "poème complet",
    "partie d'un livre"
  ],
  "既": [
    "déjà",
    "auparavant",
    "il y a longtemps"
  ],
  "普": [
    "universel",
    "largement",
    "généralement",
    "Prusse"
  ],
  "豪": [
    "écrasant",
    "grand",
    "puissant",
    "éminent",
    "Australie"
  ],
  "鑑": [
    "échantillon",
    "être mis en garde",
    "apprendre de"
  ],
  "除": [
    "exclure",
    "division (opération)",
    "enlever",
    "abolir",
    "annuler"
  ],
  "尋": [
    "demander",
    "interroger",
    "rechercher",
    "brasse"
  ],
  "幾": [
    "combien",
    "quel",
    "quelques"
  ],
  "廊": [
    "couloir",
    "hall",
    "tour"
  ],
  "泥": [
    "boue",
    "fange",
    "tenir à",
    "voleur"
  ],
  "棒": [
    "bâton",
    "baguette",
    "canne",
    "barre",
    "perche",
    "massue",
    "ligne"
  ],
  "嘆": [
    "se lamenter",
    "soupirer",
    "gémir",
    "peine"
  ],
  "倉": [
    "cellier",
    "entrepôt",
    "dépôt",
    "magasin",
    "trésor"
  ],
  "孫": [
    "petits-enfants",
    "descendants"
  ],
  "巣": [
    "nid",
    "colonie (fous)",
    "ruche",
    "toile (araignée)",
    "antre"
  ],
  "径": [
    "diamètre",
    "chemin",
    "méthode"
  ],
  "救": [
    "sauvetage",
    "sauver",
    "aider",
    "secourir",
    "récupérer"
  ],
  "散": [
    "disperser",
    "éparpiller",
    "dépenser",
    "gaspiller"
  ],
  "脈": [
    "veine",
    "pouls",
    "chaîne (montagne)",
    "espoir"
  ],
  "貨": [
    "fret",
    "biens"
  ],
  "似": [
    "ressembler",
    "devenir",
    "contrefaire",
    "imiter",
    "approprié"
  ],
  "均": [
    "nivelé",
    "égalisé",
    "moyenne"
  ],
  "墓": [
    "tombe",
    "tombeau"
  ],
  "富": [
    "fortune",
    "richesse",
    "abondance"
  ],
  "探": [
    "chercher",
    "tâtonner",
    "enquête"
  ],
  "偵": [
    "espion"
  ],
  "綺": [],
  "序": [
    "début",
    "préface",
    "ordre",
    "priorité",
    "occasion",
    "avant",
    "en passant"
  ],
  "迎": [
    "accueil",
    "rencontrer",
    "saluer"
  ],
  "志": [
    "dessein",
    "intention",
    "plan",
    "motif",
    "aspirer à",
    "résolution",
    "espoirs",
    "shilling"
  ],
  "恩": [
    "faveur",
    "gentillesse",
    "bonté",
    "pitié",
    "grâce",
    "bénédiction",
    "bienfait"
  ],
  "採": [
    "cueillir",
    "prendre",
    "aller chercher"
  ],
  "永": [
    "éternité",
    "long",
    "permanent"
  ],
  "液": [
    "liquide",
    "jus",
    "fluide",
    "sève",
    "sécrétion"
  ],
  "祖": [
    "ancêtre",
    "pionnier",
    "fondateur"
  ],
  "績": [
    "performance",
    "cocons non déroulés"
  ],
  "興": [
    "intérêt",
    "divertir",
    "ranimer",
    "rétablir (fortune)",
    "plaisir",
    "prospérer"
  ],
  "衛": [
    "défense",
    "protection"
  ],
  "雑": [
    "divers"
  ],
  "複": [
    "duplication",
    "copie",
    "composé",
    "multiple",
    "compliqué"
  ],
  "賛": [
    "approuver",
    "accord",
    "louanges",
    "assister",
    "inscription sur une peinture"
  ],
  "銭": [
    "piécette",
    "monnaie",
    "1 centime de yen"
  ],
  "傷": [
    "blessure",
    "faire mal",
    "abîmer",
    "douleur",
    "entaille",
    "cicatrice",
    "point faible"
  ],
  "卵": [
    "oeuf",
    "frai"
  ],
  "厳": [
    "strict",
    "sévère",
    "rigide"
  ],
  "捨": [
    "jeter",
    "mettre au rebut",
    "abandonner",
    "démissionner",
    "rejet",
    "sacrifice"
  ],
  "込": [
    "encombré",
    "mélange",
    "en gros",
    "inclus",
    "(kokuji)"
  ],
  "汚": [
    "sale",
    "polluer",
    "disgrâce",
    "profaner",
    "souiller"
  ],
  "欲": [
    "désirer",
    "convoitise",
    "avidité",
    "passion",
    "besoin"
  ],
  "机": [
    "bureau",
    "table"
  ],
  "秘": [
    "garder secret",
    "cacher"
  ],
  "訳": [
    "traduire",
    "excuse",
    "cause",
    "circonstance",
    "cas"
  ],
  "染": [
    "teindre",
    "tache",
    "pollution",
    "colorer",
    "peindre",
    "imprimer"
  ],
  "簡": [
    "simplicité",
    "brièveté"
  ],
  "誌": [
    "document",
    "dossier"
  ],
  "窓": [
    "fenêtre",
    "vitre"
  ],
  "否": [
    "non",
    "nier",
    "refuser",
    "décliner"
  ],
  "筋": [
    "muscle",
    "tendon",
    "fibre",
    "veine",
    "intrigue",
    "lignée",
    "raison"
  ],
  "宝": [
    "trésor",
    "richesses",
    "objets de valeur"
  ],
  "宣": [
    "proclamer",
    "dire",
    "annoncer"
  ],
  "尊": [
    "révérer",
    "précieux",
    "noble",
    "haut placé"
  ],
  "拡": [
    "élargir",
    "étendre",
    "développer",
    "agrandir"
  ],
  "敬": [
    "respect",
    "déférence",
    "honorer",
    "révérer"
  ],
  "暮": [
    "mener sa vie",
    "vivre",
    "arriver à son terme",
    "coucher de soleil"
  ],
  "熟": [
    "mûrir",
    "maturité",
    "acquérir des capacités"
  ],
  "異": [
    "inhabituel",
    "bizarrerie",
    "étrangeté",
    "surprenant",
    "curieux",
    "extraordinaire"
  ],
  "皇": [
    "empereur"
  ],
  "盛": [
    "prospérité",
    "boom",
    "copuler"
  ],
  "漠": [
    "vague",
    "obscur",
    "désert",
    "vaste"
  ],
  "糖": [
    "sucre"
  ],
  "肺": [
    "poumon"
  ],
  "蒸": [
    "cuire à la vapeur",
    "chauffer",
    "torride",
    "fomenter",
    "renfermé"
  ],
  "蔵": [
    "entrepôt",
    "salle de stockage",
    "cacher",
    "avoir",
    "posséder"
  ],
  "装": [
    "revêtir",
    "tenue",
    "déguisement",
    "prétendre",
    "faire semblant"
  ],
  "裏": [
    "arrière",
    "revers",
    "verso",
    "intérieur",
    "semelle",
    "paume",
    "envers",
    "doublure",
    "mauvais côté"
  ],
  "諸": [
    "multiples",
    "plusieurs",
    "différents",
    "divers",
    "ensemble"
  ],
  "賃": [
    "tarif",
    "prix",
    "frais",
    "charges",
    "droits (d'inscription)",
    "location",
    "salaire"
  ],
  "臓": [
    "entrailles",
    "viscères",
    "intestins"
  ],
  "貴": [
    "précieux",
    "de valeur",
    "prisé",
    "estimé",
    "honneur"
  ],
  "丼": [],
  "吐": [
    "cracher",
    "vomir",
    "roter",
    "avouer",
    "dire des mensonges"
  ],
  "隷": [
    "esclave",
    "serviteur",
    "prisonnier",
    "criminel",
    "adepte"
  ],
  "芋": [
    "pomme de terre"
  ],
  "縮": [
    "rétrécir",
    "contracter",
    "raccourcir",
    "friser",
    "réduire"
  ],
  "縦": [
    "vertical",
    "longueur",
    "hauteur",
    "égoïste",
    "entêté"
  ],
  "粋": [
    "élégance",
    "chic",
    "style",
    "pureté",
    "essence",
    "élite",
    "de choix"
  ],
  "聖": [
    "saint",
    "sage",
    "maître",
    "prêtre"
  ],
  "磁": [
    "aimant",
    "porcelaine"
  ],
  "射": [
    "lancer une flèche",
    "tir à l'arc",
    "sur",
    "briller"
  ],
  "拝": [
    "culte",
    "adorer",
    "prier"
  ],
  "薦": [
    "recommander",
    "natte",
    "conseiller",
    "encourager",
    "proposer"
  ],
  "推": [
    "présumer",
    "déduire",
    "deviner",
    "supposer",
    "soutenir"
  ],
  "沿": [
    "longer",
    "suivre",
    "parallèle à"
  ],
  "源": [
    "source",
    "origine"
  ],
  "劇": [
    "théâtre",
    "pièce (théâtre)"
  ],
  "歓": [
    "joie",
    "plaisir",
    "ravissement"
  ],
  "承": [
    "consentir",
    "entendre",
    "écouter",
    "être informé",
    "recevoir"
  ],
  "損": [
    "blesser",
    "nuire",
    "dommages",
    "perte"
  ],
  "枝": [
    "branche",
    "rameau",
    "brindille",
    "compteur de branches"
  ],
  "爪": [
    "ongle",
    "griffe",
    "serre",
    "plectre"
  ],
  "刻": [
    "graver",
    "découper",
    "émincer",
    "hacher",
    "moment",
    "gravure"
  ],
  "腐": [
    "pourrir",
    "putréfier",
    "aigre"
  ],
  "遅": [
    "retard",
    "lent",
    "précédent",
    "plus tard"
  ],
  "測": [
    "brasse",
    "mesurer",
    "sonder",
    "plan"
  ],
  "舎": [
    "chaumière",
    "hutte",
    "auberge",
    "maison",
    "résidence"
  ],
  "講": [
    "cours magistral",
    "club",
    "association"
  ],
  "紹": [
    "présentations",
    "introduction",
    "hériter",
    "aider"
  ],
  "介": [
    "immixtion",
    "coquillage",
    "intervention",
    "intermédiaire",
    "s'occuper de"
  ],
  "己": [
    "soi",
    "serpent",
    "signe du 6è tronc céleste"
  ],
  "厄": [
    "malchance",
    "infortune",
    "désastre"
  ],
  "亀": [
    "tortue"
  ],
  "剣": [
    "sabre",
    "épée",
    "lame",
    "aiguille de montre"
  ],
  "寿": [
    "longévité",
    "félicitations",
    "vie"
  ],
  "彼": [
    "lui",
    "celui-là"
  ],
  "恥": [
    "honte",
    "déshonneur"
  ],
  "杉": [
    "cèdre",
    "cryptomère"
  ],
  "汁": [
    "soupe",
    "jus",
    "bouillon",
    "sève",
    "pus"
  ],
  "噌": [],
  "炎": [
    "inflammation",
    "flamme",
    "incendie"
  ],
  "熊": [
    "ours"
  ],
  "獄": [
    "prison"
  ],
  "酔": [
    "ivre",
    "se sentir malade",
    "empoisonné",
    "transporté de joie",
    "subjugué"
  ],
  "鍋": [],
  "湖": [
    "lac"
  ],
  "銅": [
    "cuivre"
  ],
  "油": [
    "huile",
    "gras"
  ],
  "醤": [],
  "旧": [
    "ancien temps",
    "anciennes choses",
    "ancien ami",
    "ancien -",
    "ex-"
  ],
  "貿": [
    "commerce",
    "négoce",
    "échanges"
  ],
  "将": [
    "dirigeant",
    "commandant",
    "général",
    "amiral",
    "ou",
    "l'un après l'autre",
    "bientôt",
    "à partir de maintenant",
    "à peu près"
  ],
  "盟": [
    "alliance",
    "serment"
  ],
  "伸": [
    "allonger",
    "étirer",
    "accroître",
    "étendre",
    "augmenter"
  ],
  "債": [
    "dette",
    "prêt",
    "titre"
  ],
  "及": [
    "allonger",
    "tendre le bras",
    "exercice",
    "s'étendre",
    "causer"
  ],
  "奈": [
    "Nara",
    "comment ?"
  ],
  "廃": [
    "abolition",
    "obsolète",
    "cessation",
    "déchets",
    "mettre au rebut",
    "abandonner"
  ],
  "換": [
    "échanger",
    "remplacer",
    "convertir",
    "change"
  ],
  "核": [
    "noyau",
    "nucléaire",
    "coeur"
  ],
  "沖": [
    "au large",
    "en haute mer",
    "montée au ciel"
  ],
  "縄": [
    "corde",
    "corde de paille"
  ],
  "津": [
    "havre",
    "port",
    "bac"
  ],
  "療": [
    "soins",
    "traitement"
  ],
  "継": [
    "hériter",
    "succession",
    "relais",
    "rapiécer",
    "greffe (arbre)"
  ],
  "舞": [
    "danse",
    "voltiger",
    "cercle",
    "roue"
  ],
  "伎": [],
  "般": [
    "global",
    "général",
    "transporter",
    "transporteur"
  ],
  "頼": [
    "confiance",
    "demande"
  ],
  "依": [
    "dépendant",
    "par conséquent",
    "donc",
    "dû à"
  ],
  "諾": [
    "consentement",
    "assentiment",
    "accord"
  ],
  "牙": [
    "croc",
    "défense",
    "radical défense d'ivoire (no. 92)"
  ],
  "跳": [
    "sauter",
    "bondir",
    "caracoler",
    "ruer (cheval)",
    "jaillir",
    "gicler",
    "craquer",
    "collision"
  ],
  "漁": [
    "pêcher (en masse)",
    "pêcherie"
  ],
  "償": [
    "compensation",
    "réparation",
    "indemnisation",
    "se racheter",
    "récompense"
  ],
  "刑": [
    "peine",
    "sanction",
    "condamnation",
    "punition"
  ],
  "募": [
    "recruter",
    "mener une campagne",
    "appel (contributions)",
    "enrôler",
    "devenir violent"
  ],
  "執": [
    "prendre en charge",
    "saisir",
    "ténacité",
    "prendre à coeur"
  ],
  "崩": [
    "s'effondrer",
    "mourir",
    "démolir",
    "niveler"
  ],
  "患": [
    "maladie",
    "affection",
    "souffrir de",
    "patient"
  ],
  "戻": [
    "revenir",
    "re-",
    "reprendre",
    "restaurer",
    "rendre",
    "revenir en arrière"
  ],
  "抗": [
    "s'opposer à",
    "confrontation",
    "résister",
    "contester",
    "nier (évidence)",
    "anti-"
  ],
  "旬": [
    "décade",
    "saison (fruits, poisson, ...)"
  ],
  "湾": [
    "golfe",
    "baie",
    "crique"
  ],
  "爆": [
    "bombe",
    "faire éclater",
    "exploser",
    "craquer"
  ],
  "弾": [
    "boulet",
    "rebond",
    "chiquenaude",
    "vibration"
  ],
  "聴": [
    "écouter",
    "têtu",
    "vilain",
    "sans même demander"
  ],
  "跡": [
    "traces",
    "marques",
    "vestiges",
    "empreinte"
  ],
  "遣": [
    "expédier",
    "envoyer",
    "donner",
    "faire",
    "entreprendre"
  ],
  "闘": [
    "lutte",
    "guerre"
  ],
  "陣": [
    "campement",
    "ordre de bataille",
    "rang",
    "position"
  ],
  "香": [
    "senteur",
    "encens",
    "parfum"
  ],
  "兆": [
    "augures",
    "présage",
    "signe",
    "symptômes",
    "10**12",
    "1000 milliards"
  ],
  "臨": [
    "faire face à",
    "rencontrer",
    "affronter",
    "assister à",
    "passer voir",
    "se rendre sur place",
    "exceptionnel"
  ],
  "削": [
    "raboter",
    "tailler",
    "affiler",
    "réduire",
    "parer",
    "supprimer"
  ],
  "恵": [
    "bénéficier de",
    "faveur divine",
    "grâce",
    "gentillesse"
  ],
  "抱": [
    "prendre dans les bras",
    "étreindre",
    "embrasser"
  ],
  "掲": [
    "afficher",
    "hisser (drapeau)",
    "insertion",
    "cité (ci-dessus)",
    "faire paraître",
    "publier",
    "décrire"
  ],
  "狙": [
    "viser",
    "mire",
    "ombre",
    "rôder"
  ],
  "葬": [
    "funérailles",
    "enterrer",
    "abandonner (ajourner)"
  ],
  "需": [
    "demande",
    "requête",
    "besoin"
  ],
  "齢": [
    "âge"
  ],
  "宜": [
    "convenable",
    "bon",
    "mes amitiés!"
  ],
  "繰": [
    "embobiner",
    "bobine",
    "faire tourner",
    "tourner (pages)",
    "feuilleter",
    "parler de"
  ],
  "避": [
    "éviter",
    "fuir",
    "parer",
    "écarter (danger)",
    "empêcher",
    "se dérober"
  ],
  "妊": [
    "grossesse",
    "enceinte (femme)"
  ],
  "娠": [
    "femme enceinte"
  ],
  "致": [
    "faire",
    "causer",
    "provoquer",
    "commettre",
    "envoyer",
    "expédier",
    "encourir",
    "engager"
  ],
  "奏": [
    "jouer de la musique",
    "concert",
    "parler à l'Empereur",
    "mener à bien"
  ],
  "伴": [
    "être accompagné",
    "amener avec soi",
    "compagnon",
    "époux / épouse"
  ],
  "併": [
    "faire correspondre",
    "joindre",
    "unir",
    "cependant",
    "simultané"
  ],
  "却": [
    "au lieu de",
    "au contraire",
    "plutôt"
  ],
  "慮": [
    "prudence",
    "idée",
    "sollicitude",
    "considérer",
    "délibérer",
    "peur"
  ],
  "懸": [
    "suspendre",
    "pendre",
    "10%",
    "installer",
    "dépendre",
    "consulter"
  ],
  "扱": [
    "manoeuvrer",
    "prendre en main",
    "battre",
    "arracher"
  ],
  "択": [
    "choisir",
    "sélectionner",
    "élire",
    "préférer"
  ],
  "描": [
    "croquis",
    "dessiner",
    "composer",
    "écrire",
    "peindre"
  ],
  "盤": [
    "plateau",
    "bol creux",
    "plat",
    "bassin",
    "échiquier (Go)",
    "disque (musique)"
  ],
  "称": [
    "appellation",
    "louanges",
    "admirer",
    "nom",
    "titre",
    "renommée"
  ],
  "緩": [
    "relâcher",
    "abaisser",
    "décompresser",
    "lâche (noeud)",
    "modéré",
    "aise"
  ],
  "賄": [
    "corruption",
    "pot-de-vin",
    "nourrir",
    "fourniture",
    "préparation",
    "payer"
  ],
  "賂": [],
  "贈": [
    "cadeau",
    "envoyer",
    "offrir",
    "donner",
    "accorder",
    "conférer",
    "remise (prix)"
  ],
  "逃": [
    "s'évader",
    "s'échapper",
    "fuir",
    "se dérober à",
    "libérer"
  ],
  "超": [
    "dépasser",
    "super-",
    "sur-"
  ],
  "邦": [
    "pays natal",
    "pays",
    "Japon"
  ],
  "鈴": [
    "clochette",
    "sonnerie"
  ],
  "阜": [],
  "岐": [
    "bifurcation",
    "embranchement",
    "scène",
    "arène",
    "théâtre"
  ],
  "雇": [
    "employer",
    "embaucher"
  ],
  "控": [
    "se retenir",
    "s'abstenir",
    "se retirer",
    "réservé",
    "modéré"
  ],
  "棋": [
    "pièce d'échec",
    "échecs japonais",
    "shogi"
  ],
  "渋": [
    "astringent",
    "hésiter",
    "rechigner",
    "diarrhée",
    "chic"
  ],
  "群": [
    "troupeau",
    "groupe",
    "foule",
    "essaim"
  ],
  "仙": [
    "ermite",
    "magicien",
    "centime",
    "sacrum"
  ],
  "充": [
    "attribuer",
    "affecter",
    "répartir",
    "être plein"
  ],
  "免": [
    "excuser",
    "licenciement"
  ],
  "勧": [
    "persuader",
    "recommander",
    "conseiller",
    "encourager",
    "offre"
  ],
  "圏": [
    "sphère",
    "domaine",
    "bloc",
    "orbite",
    "rayon",
    "zone"
  ],
  "埼": [
    "cap",
    "promontoire",
    "pointe"
  ],
  "奪": [
    "dérober",
    "prendre de force",
    "arracher (des mains)",
    "déposséder",
    "piller",
    "usurper"
  ],
  "御": [
    "honorable",
    "diriger",
    "contrôler"
  ],
  "拒": [
    "refuser",
    "repousser",
    "rejeter",
    "décliner"
  ],
  "枠": [
    "cadre",
    "structure",
    "bobine",
    "bounding box (graph.)",
    "(kokuji)"
  ],
  "甲": [
    "armure",
    "carapace",
    "haute (voix)",
    "premier ordre",
    "première classe",
    "ancien",
    "cou-de-pied",
    "signe du 1er tronc céleste"
  ],
  "祉": [
    "bien-être",
    "bonheur"
  ],
  "譲": [
    "céder",
    "transférer",
    "transmettre"
  ],
  "謙": [
    "modestie",
    "humilité",
    "condescendre"
  ],
  "躍": [
    "bond",
    "danse",
    "sautiller"
  ],
  "銃": [
    "fusil",
    "armes"
  ],
  "項": [
    "paragraphe",
    "clause",
    "nuque",
    "article (item)",
    "terme (expression)"
  ],
  "鋼": [
    "acier"
  ],
  "駐": [
    "stationner",
    "résident"
  ],
  "駆": [
    "conduire",
    "courir",
    "galoper",
    "aiguillonner",
    "pousser à"
  ],
  "唱": [
    "chant",
    "choeur",
    "réciter",
    "invoquer",
    "hurlement"
  ],
  "孝": [
    "piété filiale",
    "respect des anciens"
  ],
  "俊": [
    "sagacité",
    "génie",
    "excellence",
    "avisé"
  ],
  "兼": [
    "simultanément",
    "et",
    "cumuler"
  ],
  "剤": [
    "dose",
    "médicament",
    "drogue",
    "produit pour..."
  ],
  "堀": [
    "canal",
    "fossé",
    "douves"
  ],
  "巡": [
    "patrouille",
    "faire le tour",
    "pèlerinage",
    "circonférence"
  ],
  "戒": [
    "châtiment",
    "avertissement"
  ],
  "排": [
    "répudier",
    "exclure",
    "rejeter",
    "expulser"
  ],
  "携": [
    "portatif",
    "porter en main",
    "armé (d'un ..)",
    "amener"
  ],
  "敏": [
    "vivacité d'esprit",
    "vif",
    "intelligent"
  ],
  "敷": [
    "étaler",
    "paver",
    "s'asseoir",
    "promulguer"
  ],
  "殿": [
    "Monseigneur",
    "hall",
    "résidence",
    "palais",
    "temple",
    "seigneur"
  ],
  "犠": [
    "sacrifice"
  ],
  "獲": [
    "prise",
    "capturer",
    "obtenir",
    "gagner",
    "acquérir",
    "pouvoir",
    "pouvoir faire"
  ],
  "茂": [
    "pousser dru",
    "s'épaissir",
    "luxuriant"
  ],
  "頻": [
    "sans cesse",
    "récurrent",
    "fréquemment"
  ],
  "殖": [
    "croître",
    "augmenter",
    "multiplier",
    "élever"
  ],
  "薄": [
    "fin",
    "dilué",
    "léger (thé)"
  ],
  "衝": [
    "collision",
    "choc",
    "route principale",
    "opposition (astronomie)",
    "point clé",
    "percer",
    "poignarder",
    "piquer"
  ],
  "褒": [
    "éloge",
    "louer"
  ],
  "隣": [
    "voisin"
  ],
  "雅": [
    "bon goût",
    "élégant",
    "gracieux",
    "raffiné"
  ],
  "遜": [],
  "徹": [
    "pénétrer",
    "clair (limpide)",
    "percer",
    "toucher (cible)",
    "toute la nuit (sans dormir)"
  ],
  "瀬": [
    "rapides",
    "courant",
    "torrent",
    "hauts fonds"
  ],
  "撤": [
    "retirer",
    "enlever",
    "désarmer",
    "démanteler",
    "rejeter",
    "exclure"
  ],
  "拠": [
    "point d'appui",
    "prise",
    "basé sur",
    "suivre",
    "par conséquent"
  ],
  "儀": [
    "cérémonie",
    "règle",
    "affaire",
    "cas",
    "matière",
    "manières"
  ],
  "棄": [
    "abandonner",
    "jeter",
    "se débarrasser",
    "renoncer",
    "rejeter",
    "sacrifier"
  ],
  "蛍": [
    "ver luisant",
    "luciole"
  ],
  "酎": [],
  "蜜": [
    "miel",
    "nectar",
    "mélasse"
  ],
  "艦": [
    "navire de guerre"
  ],
  "潜": [
    "s'immerger",
    "se cacher",
    "se dissimuler",
    "s'embusquer",
    "voix basse",
    "chut!"
  ],
  "拳": [],
  "炭": [
    "charbon de bois",
    "charbon"
  ],
  "畑": [
    "ferme",
    "champ",
    "jardin",
    "sa spécialité",
    "(kokuji)"
  ],
  "衣": [
    "vêtement",
    "habillement"
  ],
  "仁": [
    "humanité",
    "vertu",
    "bienveillance",
    "charité",
    "grandeur d'âme",
    "homme",
    "noyau"
  ],
  "鉱": [
    "minéral",
    "minerai"
  ],
  "誠": [
    "sincérité",
    "avertir",
    "prévenir",
    "interdire",
    "vérité",
    "fidélité"
  ],
  "郷": [
    "village natal",
    "village",
    "lieu de naissance",
    "région"
  ],
  "侵": [
    "intrusion",
    "invasion",
    "empiéter",
    "raid",
    "entrer sans permission",
    "violer (lieu)"
  ],
  "偽": [
    "faux",
    "mensonge",
    "berner",
    "prétendre",
    "imitation",
    "contrefaçon"
  ],
  "克": [
    "surmonter",
    "aimable",
    "habile"
  ],
  "到": [
    "arrivée",
    "atteindre",
    "arriver à",
    "aboutir à"
  ],
  "哲": [
    "philosophie",
    "clair"
  ],
  "喪": [
    "perte",
    "deuil"
  ],
  "堅": [
    "tenace",
    "dur",
    "strict",
    "solide",
    "ferme",
    "fiable"
  ],
  "床": [
    "plancher",
    "lit",
    "rembourrage",
    "tatami",
    "compteur de lits"
  ],
  "弧": [
    "arc de cercle",
    "arc",
    "arche"
  ],
  "挑": [
    "défier",
    "rivaliser",
    "provoquer",
    "faire des avances"
  ],
  "揚": [
    "hisser",
    "frire"
  ],
  "握": [
    "s'agripper",
    "tenir",
    "mouler (sushis)",
    "soudoyer"
  ],
  "斎": [
    "purification",
    "nourriture bouddhiste",
    "pièce",
    "adorer",
    "éviter",
    "semblable"
  ],
  "析": [
    "analyser",
    "hacher",
    "déchirer",
    "diviser"
  ],
  "暫": [
    "un certain temps",
    "temporaire",
    "un moment",
    "depuis longtemps"
  ],
  "枢": [
    "pivot",
    "charnière",
    "porte"
  ],
  "泊": [
    "passer la nuit",
    "loger",
    "séjour",
    "être au mouillage"
  ],
  "滑": [
    "glisser",
    "glissant",
    "rater"
  ],
  "潟": [
    "lagon"
  ],
  "焦": [
    "carboniser",
    "roussir",
    "brûler",
    "impatient",
    "pressé",
    "foyer (lentille)"
  ],
  "範": [
    "modèle",
    "exemple"
  ],
  "紛": [
    "emmêler",
    "confusion",
    "s'égarer",
    "détourner"
  ],
  "綱": [
    "haussière",
    "classe (genre)",
    "corde",
    "câble"
  ],
  "網": [
    "filet",
    "réseau"
  ],
  "芝": [
    "pelouse",
    "gazon"
  ],
  "荒": [
    "brutalité",
    "dévaster",
    "rude",
    "sauvage"
  ],
  "袋": [
    "sac",
    "sacoche",
    "mère"
  ],
  "誰": [
    "qui",
    "quelqu'un"
  ],
  "珍": [
    "rare",
    "curieux",
    "étrange"
  ],
  "襲": [
    "attaquer",
    "assaillir",
    "agresser",
    "hériter",
    "accumuler"
  ],
  "貢": [
    "tribut",
    "contribution",
    "financer"
  ],
  "距": [
    "longue distance",
    "éperon (botanique)",
    "fanon (de cheval)"
  ],
  "籍": [
    "enrôler",
    "domicile",
    "registre (état civil, domicile)",
    "adhésion"
  ],
  "露": [
    "rosée",
    "larmes",
    "dévoiler",
    "Russie"
  ],
  "牧": [
    "élevage",
    "soigner",
    "berger",
    "nourrir",
    "pâturage"
  ],
  "朗": [
    "radieux",
    "brillant",
    "clair",
    "mélodieux",
    "serein",
    "joyeux"
  ],
  "潮": [
    "marée",
    "eau salée",
    "opportunité"
  ],
  "即": [
    "instantané",
    "c'est-à-dire",
    "en l'état",
    "se conformer",
    "être d'accord",
    "être adapté"
  ],
  "垣": [
    "haie",
    "clôture",
    "mur"
  ],
  "威": [
    "intimidant",
    "dignité",
    "majesté",
    "menacer"
  ],
  "筒": [
    "cylindre",
    "tuyau",
    "tube",
    "canon (fusil)",
    "manche"
  ],
  "岳": [
    "pointe",
    "pic",
    "montagne"
  ],
  "慰": [
    "réconforter",
    "divertissement",
    "séduire",
    "consoler",
    "remonter",
    "s'amuser de"
  ],
  "懇": [
    "sociable",
    "gentil",
    "courtois",
    "hospitalier",
    "cordial"
  ],
  "摩": [
    "irriter",
    "gratter",
    "caresser",
    "frictionner",
    "polir",
    "moudre"
  ],
  "擦": [
    "abrasion",
    "gratter",
    "frotter",
    "râper",
    "racler",
    "irriter",
    "récurer"
  ],
  "撲": [
    "battre",
    "claque",
    "frapper",
    "coup",
    "dire",
    "parler"
  ],
  "斉": [
    "arranger",
    "égal",
    "semblable",
    "même variété"
  ],
  "旨": [
    "délicieux",
    "très bien",
    "savoureux",
    "avoir un penchant pour",
    "portée",
    "volonté",
    "intelligent",
    "expert"
  ],
  "柔": [
    "tendre",
    "faiblesse",
    "douceur"
  ],
  "沈": [
    "couler",
    "être submergé",
    "s'enfoncer",
    "être déprimé",
    "aloès"
  ],
  "泰": [
    "paisible",
    "calme",
    "paix",
    "tranquille",
    "Thaïlande"
  ],
  "滅": [
    "anéantir",
    "détruire",
    "ruiner",
    "renverser",
    "périr"
  ],
  "滋": [
    "nourrissant",
    "de plus en plus",
    "luxuriant",
    "plantation",
    "turbidité"
  ],
  "炉": [
    "fournaise",
    "foyer",
    "four",
    "réacteur"
  ],
  "寸": [
    "dimension",
    "un peu",
    "sun = 3,03 cm (1/10 de shaku)"
  ],
  "竜": [
    "dragon",
    "impérial"
  ],
  "翼": [
    "aile",
    "avion",
    "flanc"
  ],
  "吉": [
    "bonne chance",
    "joie",
    "félicitations"
  ],
  "刃": [
    "lame",
    "épée",
    "fil (épée)"
  ],
  "桃": [
    "pêche (fruit)"
  ],
  "謎": [],
  "侍": [
    "serviteur",
    "samouraï",
    "servir"
  ],
  "娯": [
    "divertissement",
    "distraction"
  ],
  "俺": [],
  "斗": [
    "Grande Ourse",
    "tonnelet de saké",
    "to (18,039 litres)",
    "radical points et croix (no. 68)"
  ],
  "朱": [
    "vermillon",
    "rouge",
    "écarlate",
    "sanglant"
  ],
  "丘": [
    "colline",
    "butte"
  ],
  "梨": [
    "poire"
  ],
  "僕": [
    "je (masculin)",
    "moi",
    "serviteur"
  ],
  "叫": [
    "crier",
    "hurler",
    "s'exclamer"
  ],
  "釣": [
    "rendre la monnaie",
    "pêche à la ligne",
    "attraper",
    "attirer",
    "capturer"
  ],
  "髪": [
    "cheveux"
  ],
  "嵐": [
    "tempête"
  ],
  "涙": [
    "larme",
    "compassion"
  ],
  "缶": [
    "boîte de conserve",
    "récipient",
    "radical jarre (no. 121)"
  ],
  "姫": [
    "princesse"
  ],
  "粒": [
    "grain",
    "goutte",
    "compteur de particules"
  ],
  "棚": [
    "étagère",
    "rayon",
    "rebord",
    "support",
    "tablette",
    "manteau (cheminée)",
    "treillis (vigne)"
  ],
  "砲": [
    "canon",
    "fusil"
  ],
  "芽": [
    "bourgeon",
    "pousse",
    "brin",
    "germe"
  ],
  "澄": [
    "limpide",
    "clair",
    "clarifier",
    "lucidité",
    "se dégager",
    "tendre (l'oreille)",
    "attitude composée"
  ],
  "矛": [
    "hallebarde",
    "armes",
    "char de festival"
  ],
  "肌": [
    "épiderme",
    "texture",
    "grain",
    "corps"
  ],
  "鐘": [
    "cloche",
    "gong",
    "carillon"
  ],
  "凶": [
    "vaurien",
    "mauvais",
    "malchance",
    "désastre"
  ],
  "塊": [
    "motte",
    "caillot",
    "masse"
  ],
  "頃": [
    "temps",
    "époque",
    "environ",
    "vers"
  ],
  "魂": [
    "âme",
    "esprit"
  ],
  "脚": [
    "pied (d'un objet)",
    "patins",
    "train d'atterrissage"
  ],
  "也": [],
  "井": [
    "puits",
    "margelle",
    "ville",
    "communauté"
  ],
  "嬢": [
    "mademoiselle",
    "jeune fille",
    "fille"
  ],
  "暦": [
    "calendrier",
    "almanach"
  ],
  "曇": [
    "temps couvert",
    "se couvrir"
  ],
  "裸": [
    "nudité",
    "nu",
    "découvert",
    "partiellement habillé"
  ],
  "賭": [
    "parier",
    "miser",
    "jouer"
  ],
  "塾": [
    "cours du soir",
    "école privée"
  ],
  "卓": [
    "éminent",
    "haut",
    "table"
  ],
  "磨": [
    "polir",
    "moudre",
    "récurer",
    "améliorer",
    "brosser (dents)"
  ],
  "陰": [
    "Yin",
    "ombre",
    "négatif",
    "secret",
    "organes sexuels"
  ],
  "霊": [
    "esprits",
    "âmes"
  ],
  "湿": [
    "moite",
    "humide",
    "mouillé"
  ],
  "硬": [
    "dur",
    "raide"
  ],
  "嫁": [
    "prendre mari",
    "mariage",
    "belle-fille"
  ],
  "溝": [
    "rigole",
    "fossé",
    "égout",
    "10**32"
  ],
  "狂": [
    "fou",
    "aliéné",
    "insensé",
    "confusion"
  ],
  "墨": [
    "encre noire",
    "encre de Chine",
    "bâtonnet d'encre",
    "Mexique"
  ],
  "穏": [
    "paisible",
    "calme",
    "modéré"
  ],
  "魔": [
    "sorcière",
    "démon",
    "esprit malfaisant"
  ],
  "寮": [
    "dortoir",
    "foyer",
    "pavillon",
    "pavillon de thé"
  ],
  "盆": [
    "bassin",
    "fête des lanternes (oBon)",
    "plateau"
  ],
  "棟": [
    "faîte",
    "bâtiment"
  ],
  "斬": [],
  "寧": [
    "plutôt",
    "de préférence",
    "paisible"
  ],
  "歳": [
    "fin d'année",
    "âge",
    "compteur d'années",
    "occasion",
    "opportunité"
  ],
  "涼": [
    "rafraîchissant",
    "frais"
  ],
  "猿": [
    "singe"
  ],
  "鍵": [],
  "零": [
    "zéro",
    "se répandre",
    "déborder",
    "rien",
    "code"
  ],
  "租": [
    "droits",
    "taxe",
    "impôt",
    "emprunt"
  ],
  "幽": [
    "isoler",
    "confiné",
    "profond",
    "obscur",
    "isolé",
    "faible",
    "sombre",
    "tranquille",
    "calme"
  ],
  "泡": [
    "bulle",
    "mousse",
    "écume"
  ],
  "癖": [
    "manie",
    "mauvaise habitude",
    "vice",
    "trait (caractère)",
    "défaut",
    "frisé"
  ],
  "錬": [
    "endurcir",
    "améliorer",
    "entrainer",
    "perfectionner",
    "écrouir"
  ],
  "穂": [
    "épi",
    "pointe",
    "crête (vague)"
  ],
  "瞬": [
    "cligner",
    "pétiller (yeux)"
  ],
  "誇": [
    "vantardise",
    "orgueil",
    "fierté",
    "triomphant"
  ],
  "庄": [],
  "阻": [
    "faire obstacle",
    "obstruer",
    "contrarier",
    "séparer",
    "dissuader",
    "empêcher"
  ],
  "黙": [
    "silence",
    "se taire",
    "laisser en l'état"
  ],
  "俵": [
    "sac de paille",
    "sac",
    "botte de paille",
    "compteur de sacs"
  ],
  "綿": [
    "coton"
  ],
  "粘": [
    "collant",
    "gluant",
    "graisseux",
    "persévérer"
  ],
  "架": [
    "ériger",
    "monter",
    "suspendre (pont)",
    "supporter (poids)",
    "étagère",
    "construire"
  ],
  "詐": [
    "mentir",
    "fausseté",
    "fraude",
    "tromper",
    "duper",
    "feindre"
  ],
  "霧": [
    "brouillard",
    "brume"
  ],
  "柳": [
    "saule"
  ],
  "伊": [
    "Italie",
    "celui-là"
  ],
  "尺": [
    "shaku (30,303 cm)",
    "mesure",
    "échelle",
    "règle"
  ],
  "哀": [
    "pitoyable",
    "peine",
    "chagrin",
    "pitié",
    "pathétique",
    "compatir"
  ],
  "塀": [
    "barrière",
    "mur",
    "(kokuji)"
  ],
  "墜": [
    "s'écraser",
    "tomber"
  ],
  "如": [
    "ressemblance",
    "comme",
    "comme si",
    "mieux",
    "meilleur",
    "égal",
    "similaire",
    "paraître"
  ],
  "婆": [
    "vieille femme",
    "grand-mère",
    "nourrice"
  ],
  "崖": [],
  "帽": [
    "casquette",
    "couvre-chef"
  ],
  "恨": [
    "ressentiment",
    "regret",
    "rancune",
    "méchanceté",
    "haine"
  ],
  "憩": [
    "vacances",
    "repos",
    "détente",
    "relaxation"
  ],
  "扇": [
    "ventilateur",
    "éventail"
  ],
  "扉": [
    "porte d'entrée",
    "première page",
    "page de titre"
  ],
  "掌": [
    "paume",
    "manipuler",
    "administrer",
    "diriger",
    "gouverner"
  ],
  "炊": [
    "cuisiner",
    "cuire"
  ],
  "爽": [],
  "瞭": [],
  "胴": [
    "tronc (du corps)",
    "torse",
    "coque (bateau)",
    "moyeu"
  ],
  "芯": [],
  "帳": [
    "cahier",
    "livre de comptes",
    "album"
  ],
  "蛇": [
    "serpent",
    "gros buveur"
  ],
  "貼": [],
  "辱": [
    "humilier",
    "embarrasser",
    "déshonorer"
  ],
  "闇": [],
  "隙": [],
  "飢": [
    "faim",
    "famine"
  ],
  "餓": [
    "famine",
    "faim",
    "soif"
  ],
  "畜": [
    "bétail",
    "animaux domestiques"
  ],
  "迅": [
    "vif",
    "rapide"
  ],
  "騎": [
    "cavalier",
    "monter à cheval",
    "compteur de cavaliers"
  ],
  "蓄": [
    "accumuler",
    "stocker",
    "mettre de côté",
    "gramophone",
    "avoir une maîtresse"
  ],
  "彩": [
    "colorer",
    "peindre",
    "maquillage"
  ],
  "溶": [
    "fondre",
    "dissoudre"
  ],
  "耐": [
    "à l'épreuve de",
    "résistant",
    "endurant",
    "durable"
  ],
  "踊": [
    "danser",
    "saut",
    "bond",
    "sautiller"
  ],
  "輝": [
    "étincelant",
    "étincelle",
    "briller",
    "scintiller"
  ],
  "麻": [
    "chanvre",
    "lin"
  ],
  "灯": [
    "lampe",
    "lumière",
    "compteur de lampes"
  ],
  "咲": [
    "fleurir",
    "floraison"
  ],
  "培": [
    "culture (plantes)",
    "entretenir"
  ],
  "悔": [
    "regret",
    "repentir"
  ],
  "脇": [
    "flanc",
    "aisselle",
    "de côté (regard)",
    "ailleurs (regard)",
    "second rôle"
  ],
  "班": [
    "équipe",
    "corps",
    "unité",
    "groupe"
  ],
  "塗": [
    "peinture",
    "peindre",
    "tartiner",
    "barbouiller",
    "enduire",
    "recouvrir"
  ],
  "斜": [
    "penché",
    "diagonale",
    "oblique"
  ],
  "盾": [
    "bouclier",
    "écu",
    "prétexte"
  ],
  "穫": [
    "récolte",
    "moisson"
  ],
  "駒": [
    "poulain",
    "cheval",
    "poney"
  ],
  "紫": [
    "violet"
  ],
  "誓": [
    "prêter serment",
    "promettre",
    "jurer"
  ],
  "拓": [
    "défricher",
    "conquête (terrain)"
  ],
  "拘": [
    "arrestation",
    "saisir",
    "adhérer",
    "être concerné",
    "malgré"
  ],
  "礎": [
    "première pierre",
    "première angulaire"
  ],
  "鶴": [
    "grue",
    "cigogne"
  ],
  "刈": [
    "moissonner",
    "faucher",
    "tondre",
    "tailler",
    "couper"
  ],
  "唯": [
    "seulement",
    "unique",
    "simplement"
  ],
  "尼": [
    "nonne"
  ],
  "概": [
    "grandes lignes",
    "dans l'ensemble",
    "approximation",
    "en gros",
    "en général"
  ],
  "浸": [
    "immersion",
    "tremper",
    "plonger dans",
    "humidifier",
    "humecter",
    "mouiller"
  ],
  "煮": [
    "mijoter",
    "bouillir",
    "cuire"
  ],
  "覆": [
    "recouvrir",
    "chavirer",
    "store",
    "manteau",
    "être ruiné"
  ],
  "謀": [
    "conspirer",
    "tricher",
    "imposer",
    "concevoir",
    "plan",
    "projet",
    "avoir dans l'idée",
    "duper"
  ],
  "陶": [
    "poterie",
    "porcelaine"
  ],
  "征": [
    "conquête",
    "attaquer les barbares",
    "collecter les taxes"
  ],
  "陛": [
    "son altesse",
    "marches (du trône)"
  ],
  "俗": [
    "vulgaire",
    "coutumes",
    "manières",
    "temporel",
    "séculier"
  ],
  "桑": [
    "mûrier"
  ],
  "潤": [
    "mouillé",
    "être arrosé",
    "profit",
    "bénéfice",
    "favoriser",
    "charmer",
    "tremper"
  ],
  "珠": [
    "perle",
    "gemme",
    "joyau"
  ],
  "奨": [
    "exhorter",
    "encourager",
    "pousser à"
  ],
  "劣": [
    "infériorité",
    "inférieur à",
    "être moins bon que"
  ],
  "勘": [
    "intuition",
    "perception"
  ],
  "妃": [
    "reine",
    "princesse"
  ],
  "丈": [
    "longueur",
    "10 pieds (jo)",
    "mesure",
    "M",
    "Mme",
    "taille",
    "stature",
    "tout (ce qu'on a)",
    "seulement",
    "c'est tout"
  ],
  "峰": [
    "sommet",
    "pointe",
    "pic"
  ],
  "邪": [
    "sournois",
    "dépravé",
    "pervers",
    "mauvais"
  ],
  "駄": [
    "fardeau",
    "cheval de bât",
    "charge de cheval",
    "envoyé par cheval"
  ],
  "廷": [
    "tribunaux",
    "cour impériale",
    "bureau du gouvernement"
  ],
  "鰐": [],
  "蟹": [],
  "簿": [
    "registre",
    "livre (comptes, annuaire)"
  ],
  "彰": [
    "patent",
    "clair"
  ],
  "訂": [
    "réviser",
    "corriger",
    "décider"
  ],
  "諮": [
    "consulter"
  ],
  "銘": [
    "inscription (gravée)",
    "signature (d'un artisan)"
  ],
  "堤": [
    "digue",
    "berge",
    "rive"
  ],
  "漂": [
    "dériver",
    "flotter"
  ],
  "翻": [
    "voltiger",
    "faire flotter (drapeau)",
    "changer de sens",
    "changer (d'opinion)"
  ],
  "軌": [
    "ornière",
    "rails",
    "orbite",
    "modèle",
    "façon de faire"
  ],
  "后": [
    "impératrice",
    "reine",
    "après",
    "derrière",
    "arrière",
    "plus tard"
  ],
  "奮": [
    "excitation",
    "stimulation",
    "tonifié",
    "épanoui"
  ],
  "亭": [
    "pavillon",
    "restaurant",
    "résidence",
    "tonnelle",
    "variétés",
    "music hall",
    "nom de scène"
  ],
  "仰": [
    "regarder en l'air",
    "dire (humble)",
    "dépendre",
    "chercher",
    "respecter",
    "révérer",
    "boire",
    "prendre (nourriture)"
  ],
  "偶": [
    "par hasard",
    "nombre pair",
    "couple",
    "homme et femme",
    "même espèce"
  ],
  "淀": [],
  "壮": [
    "robuste",
    "âge d'homme",
    "prospérité"
  ],
  "把": [
    "agripper",
    "saisir",
    "fagot",
    "paquet",
    "compteur de paquets"
  ],
  "搬": [
    "transporteur",
    "transporter"
  ],
  "洞": [
    "antre",
    "grotte",
    "excavation"
  ],
  "涯": [
    "horizon",
    "rivage"
  ],
  "疫": [
    "épidémie"
  ],
  "孔": [
    "cavité",
    "trou",
    "fente",
    "très",
    "grand",
    "extrêmement"
  ],
  "頂": [
    "placer au sommet",
    "recevoir (je reçois de vous)",
    "sommet de la tête (vertex)",
    "sommet",
    "pic"
  ],
  "召": [
    "faire venir à soi",
    "appeler",
    "inviter",
    "prendre (bain)",
    "porter (vêtements)",
    "acheter",
    "conduire",
    "boire",
    "manger",
    "attraper (froid)"
  ],
  "枯": [
    "dépérir",
    "mourir",
    "se faner",
    "sec (bois)"
  ],
  "沸": [
    "bouillonner",
    "bouillir",
    "fermenter",
    "exciter",
    "élever"
  ],
  "濯": [
    "lessive",
    "laver",
    "rincer",
    "verser"
  ],
  "瓶": [
    "pot de fleurs",
    "fiole",
    "pot",
    "pichet",
    "cuve",
    "urne"
  ],
  "耕": [
    "labourer",
    "cultiver"
  ],
  "肯": [
    "accord",
    "consentement",
    "se conformer à",
    "affirmatif"
  ],
  "脂": [
    "gras",
    "graisse",
    "suif",
    "lard",
    "résine",
    "gomme",
    "goudron"
  ],
  "軒": [
    "gouttière",
    "auvent",
    "compteur de maisons"
  ],
  "軟": [
    "mou"
  ],
  "郊": [
    "périphérie",
    "banlieue",
    "zone rurale"
  ],
  "隻": [
    "compteur de bateaux",
    "compteur d'oiseaux",
    "vaisseaux",
    "poissons",
    "flèches",
    "l'un d'une paire"
  ],
  "邸": [
    "résidence",
    "hôtel particulier"
  ],
  "郡": [
    "comté",
    "arrondissement"
  ],
  "肪": [
    "obèse",
    "graisse",
    "gras",
    "gros"
  ],
  "喚": [
    "hurler",
    "crier"
  ],
  "媛": [
    "belle femme",
    "princesse"
  ],
  "玄": [
    "mystérieux",
    "occulte",
    "sombre"
  ],
  "苗": [
    "plant",
    "jeune arbre",
    "bourgeon"
  ],
  "渦": [
    "tourbillon",
    "remous",
    "vortex"
  ],
  "慈": [
    "miséricorde",
    "pitié",
    "affection"
  ],
  "襟": [
    "nuque",
    "col",
    "revers"
  ],
  "蓮": [],
  "亮": [],
  "浦": [
    "baie",
    "crique",
    "anse",
    "golfe",
    "rivage",
    "côte",
    "plage"
  ],
  "陥": [
    "s'écrouler",
    "piège",
    "tomber dans",
    "capituler",
    "tomber (château)",
    "glisser dans"
  ],
  "貫": [
    "percer",
    "kan (= 3750 g)",
    "pénétrer",
    "cohérence",
    "soutien (renfort)"
  ],
  "呂": [
    "colonne vertébrale",
    "épine dorsale",
    "grand bâtiment"
  ],
  "茨": [
    "épine",
    "églantier"
  ],
  "孤": [
    "orphelin",
    "seul"
  ],
  "賠": [
    "compensations",
    "dédommagement",
    "indemnité"
  ],
  "噴": [
    "éruption",
    "jaillir",
    "émettre",
    "gicler"
  ],
  "祥": [
    "bon présage",
    "prometteur",
    "bonheur"
  ],
  "牲": [
    "sacrifice animal",
    "offrande"
  ],
  "秩": [
    "ordre",
    "régularité",
    "salaire"
  ],
  "膨": [
    "gonfler",
    "grossir",
    "épais"
  ],
  "芳": [
    "parfum",
    "embaumé",
    "parfumé"
  ],
  "恒": [
    "constance",
    "toujours"
  ],
  "倫": [
    "éthique",
    "camarade"
  ],
  "陳": [
    "informer",
    "présenter",
    "raconter",
    "expliquer"
  ],
  "須": [
    "nécessité",
    "certainement",
    "devrait faire"
  ],
  "遇": [
    "entrevue",
    "traiter",
    "rencontrer",
    "distraire",
    "recevoir"
  ],
  "殊": [
    "particulièrement",
    "spécialement",
    "exceptionnellement"
  ],
  "慢": [
    "vanité",
    "paresse",
    "ridicule"
  ],
  "没": [
    "sombrer",
    "couler",
    "cacher",
    "immersion",
    "disparaître",
    "mourir"
  ],
  "怠": [
    "négligence",
    "paresse"
  ],
  "惰": [
    "paresse"
  ],
  "猟": [
    "chasse sportive",
    "tir",
    "jeu",
    "sac"
  ],
  "乃": [
    "enclitique \"no\"",
    "de",
    "a la suite de quoi",
    "par conséquence"
  ],
  "颯": [],
  "輔": [],
  "寛": [
    "tolérant",
    "indulgent",
    "générosité",
    "se sentir chez soi",
    "être à l'aise",
    "ouverture d'esprit"
  ],
  "胞": [
    "placenta",
    "cavité",
    "gaine"
  ],
  "随": [
    "suivre",
    "quoique",
    "néanmoins",
    "pendant",
    "les deux",
    "tout",
    "obéir",
    "se soumettre à",
    "se conformer à",
    "à la merci (des vagues)"
  ],
  "稿": [
    "brouillon",
    "copie",
    "manuscrit",
    "paille"
  ],
  "丹": [
    "couleur de rouille",
    "rouge",
    "minium",
    "pilules"
  ],
  "壌": [
    "lot de terrain",
    "sol",
    "terrain"
  ],
  "騰": [
    "inflation",
    "augmentation",
    "avance"
  ],
  "緯": [
    "horizontal",
    "trame (tissage)",
    "gauche et droite",
    "latitude"
  ],
  "艇": [
    "barque",
    "petit bateau"
  ],
  "錦": [
    "brocart",
    "belle robe",
    "honneurs"
  ],
  "剰": [
    "par dessus le marché",
    "en outre",
    "surplus"
  ],
  "繊": [
    "effilé",
    "fin",
    "kimono léger"
  ],
  "諭": [
    "réprimande",
    "admonestation",
    "conseiller",
    "prévenir",
    "persuader"
  ],
  "惨": [
    "choquant",
    "misérable",
    "désastre",
    "cruauté",
    "rude"
  ],
  "虐": [
    "tyranniser",
    "opprimer"
  ],
  "据": [
    "poser les fondations",
    "installer",
    "équiper",
    "s'accroupir",
    "s'asseoir"
  ],
  "搭": [
    "embarquement",
    "charger (un véhicule)",
    "prendre (un véhicule)"
  ],
  "蒙": [],
  "鯉": [
    "carpe"
  ],
  "戴": [
    "couronnement",
    "vivre sous (un chef)",
    "recevoir"
  ],
  "曙": [],
  "胡": [],
  "瓜": [
    "melon"
  ],
  "帥": [
    "commandant",
    "mener des troupes",
    "gouverneur"
  ],
  "葵": [],
  "駿": [],
  "諒": [],
  "莉": [],
  "荘": [
    "villa",
    "auberge",
    "maison de campagne",
    "manoir féodal"
  ],
  "栽": [
    "plantation",
    "cultiver",
    "élever"
  ],
  "拐": [
    "rapt",
    "falsifier"
  ],
  "冠": [
    "couronne",
    "le meilleur",
    "inégalable"
  ],
  "勲": [
    "mérite",
    "haut fait",
    "fait méritoire"
  ],
  "紋": [
    "armoiries",
    "motif (dessin)"
  ],
  "卸": [
    "vente en gros"
  ],
  "逸": [
    "dévier",
    "oisiveté",
    "loisirs",
    "rater",
    "s'évader",
    "échapper à",
    "s'écarter",
    "parer",
    "diverger"
  ],
  "顕": [
    "apparaître",
    "existant"
  ],
  "愚": [
    "stupide",
    "absurdité",
    "idiot",
    "bête"
  ],
  "庶": [
    "peuple",
    "roturier",
    "tout",
    "bâtard"
  ],
  "呈": [
    "dévoiler",
    "offrir",
    "présenter",
    "envoyer",
    "exposer"
  ],
  "疎": [
    "négligence",
    "ignorer",
    "aliéner",
    "éviter",
    "grossier",
    "clairsemé",
    "épars"
  ],
  "疾": [
    "rapide",
    "maladie"
  ],
  "鎌": [
    "faucille",
    "serpe",
    "faux",
    "duper"
  ],
  "酷": [
    "cruel",
    "atroce",
    "sévère",
    "injuste"
  ],
  "叙": [
    "conférer",
    "relater",
    "raconter",
    "décrire"
  ],
  "且": [
    "de plus",
    "en outre",
    "et aussi"
  ],
  "呆": [],
  "哺": [],
  "傲": [],
  "茎": [
    "tige",
    "queue"
  ],
  "悠": [
    "éternité",
    "éloigné",
    "permanence",
    "tranquille"
  ],
  "杏": [
    "abricot"
  ],
  "栞": [],
  "伏": [
    "prostré",
    "se courber",
    "s'incliner",
    "tendre (embuscade)",
    "couvrir",
    "poser (tuyaux)"
  ],
  "鎮": [
    "tranquilliser"
  ],
  "憂": [
    "mélancolie",
    "dépression",
    "chagrin",
    "lamentation",
    "triste",
    "anxieux",
    "malheureux"
  ],
  "朴": [
    "brut",
    "simple",
    "honnête",
    "docile"
  ],
  "栃": [
    "marronnier d'Inde",
    "(kokuji)"
  ],
  "惜": [
    "regret",
    "frugal",
    "radin",
    "économe"
  ],
  "佳": [
    "excellent",
    "beau",
    "bon",
    "plaisant",
    "habile"
  ],
  "悼": [
    "déplorer",
    "se lamenter",
    "deuil"
  ],
  "赴": [
    "se rendre à",
    "aller",
    "devenir",
    "se diriger vers"
  ],
  "髄": [
    "moelle",
    "quintessence"
  ],
  "傍": [
    "observateur",
    "spectateur",
    "à côté",
    "en outre",
    "pendant que",
    "tout près",
    "les autres"
  ],
  "累": [
    "amasser",
    "implication",
    "ennuis",
    "liens",
    "continuellement"
  ],
  "癒": [
    "guérison",
    "guérir",
    "désaltérer",
    "assouvir"
  ],
  "尿": [
    "urine"
  ],
  "虜": [
    "captif",
    "esclave",
    "barbare",
    "épithète péjorative pour l'ennemi"
  ],
  "憾": [
    "remords",
    "regrets",
    "être désolé",
    "maudire"
  ],
  "粗": [
    "grossier",
    "rude"
  ],
  "凝": [
    "congeler",
    "geler",
    "rigide",
    "être absorbé",
    "coagulation"
  ],
  "昌": [
    "prospère",
    "brillant",
    "clair"
  ],
  "旦": [
    "aube",
    "point du jour",
    "aurore"
  ],
  "愉": [
    "plaisir",
    "joyeux",
    "agréable"
  ],
  "抹": [
    "frotter",
    "enduire",
    "effacer"
  ],
  "之": [
    "de",
    "ceci",
    "avancer (radical shinnyuu)"
  ],
  "龍": [],
  "瑛": [],
  "拍": [
    "applaudir",
    "temps (musique)",
    "battement (coeur)"
  ],
  "宰": [
    "directeur",
    "diriger",
    "superviseur",
    "premier ministre"
  ],
  "縫": [
    "coudre",
    "suturer",
    "broder"
  ],
  "呉": [
    "tu me donnes",
    "faire pour moi"
  ],
  "凡": [
    "médiocre"
  ],
  "恭": [
    "respectueux"
  ],
  "錯": [
    "embrouillé",
    "confus",
    "complexe",
    "mélange"
  ],
  "穀": [
    "céréale",
    "grains"
  ],
  "弊": [
    "mal",
    "abus",
    "vice",
    "impropre à tout usage",
    "humblement"
  ],
  "舶": [
    "paquebot",
    "bateau"
  ],
  "窮": [
    "extrêmement",
    "indigent",
    "fauché",
    "souffrir",
    "perplexe",
    "acculé"
  ],
  "悦": [
    "extase",
    "joie",
    "ravissement"
  ],
  "縛": [
    "ficeler",
    "lier",
    "attacher",
    "arrêts",
    "contrainte"
  ],
  "轄": [
    "contrôle",
    "cale (coin)"
  ],
  "窒": [
    "obstruer",
    "suffoquer",
    "azote"
  ],
  "洪": [
    "inondation",
    "déluge",
    "vaste"
  ],
  "摂": [
    "substitut",
    "remplaçant",
    "prendre (ingérer)",
    "faire simultanément"
  ],
  "飽": [
    "saturé",
    "fatigué",
    "lassé",
    "rassasié"
  ],
  "紳": [
    "gentilhomme",
    "seigneur",
    "écharpe de chevalier"
  ],
  "庸": [
    "banal",
    "ordinaire",
    "emploi"
  ],
  "靖": [],
  "嘉": [],
  "搾": [
    "presser"
  ],
  "碑": [
    "pierre tombale",
    "monument"
  ],
  "尉": [
    "officier",
    "geôlier",
    "vieil homme",
    "rang"
  ],
  "凛": [],
  "匠": [
    "artisan",
    "ouvrier",
    "charpentier"
  ],
  "智": [
    "intelligence",
    "raison"
  ],
  "賊": [
    "bandit",
    "rebelle",
    "traitre",
    "cambrioleur",
    "voleur"
  ],
  "鼓": [
    "tambour",
    "battement",
    "encourager",
    "appel (armée)"
  ],
  "旋": [
    "rotation",
    "révolution"
  ],
  "腸": [
    "intestin",
    "entrailles",
    "viscères"
  ],
  "槽": [
    "cuve",
    "bac",
    "réservoir"
  ],
  "漬": [
    "saumure",
    "tremper",
    "humecter",
    "imbiber"
  ],
  "坪": [
    "tsubo (3,306 m² )",
    "aire de 2 tatamis standards"
  ],
  "紺": [
    "bleu marine"
  ],
  "峡": [
    "gorge",
    "ravin",
    "vallée étroite"
  ],
  "俸": [
    "traitement",
    "salaire"
  ],
  "醸": [
    "brasser",
    "causer"
  ],
  "弔": [
    "condoléances",
    "deuil",
    "funérailles"
  ],
  "乙": [
    "radical hameçon (no. 5)",
    "chic",
    "signe du 2ème tronc céleste",
    "dernier",
    "second",
    "étrange"
  ],
  "遍": [
    "partout",
    "-fois",
    "largement",
    "généralement"
  ],
  "款": [
    "bonne volonté",
    "article",
    "section",
    "fraternisation",
    "amitié",
    "connivence"
  ],
  "閲": [
    "revue",
    "inspection",
    "révision"
  ],
  "喝": [
    "gronder",
    "rauque"
  ],
  "膜": [
    "membrane"
  ],
  "盲": [
    "aveugle",
    "ignorant"
  ],
  "胎": [
    "utérus",
    "foetus"
  ],
  "堕": [
    "dégénérer",
    "sombrer",
    "s'abaisser"
  ],
  "遮": [
    "intercepter",
    "interrompre",
    "obstruer"
  ],
  "烏": [
    "corneille",
    "corbeau"
  ],
  "凸": [
    "convexe",
    "inégal",
    "gros sourcils"
  ],
  "凹": [
    "concave",
    "creux",
    "dépression"
  ],
  "楓": [],
  "蒼": [],
  "瑠": [],
  "萌": [],
  "赦": [
    "pardon"
  ],
  "窃": [
    "cambrioler",
    "secret",
    "privé",
    "discret",
    "à voix basse"
  ],
  "慨": [
    "repentir",
    "regret",
    "triste",
    "soupir",
    "plainte"
  ],
  "扶": [
    "aider",
    "assister",
    "prêter main forte"
  ],
  "戯": [
    "divertissement",
    "jeu",
    "sport"
  ],
  "忌": [
    "deuil",
    "détester",
    "répugnant",
    "anniversaire du décès"
  ],
  "奔": [
    "courir",
    "agitation",
    "précipitation"
  ],
  "肖": [
    "ressemblance",
    "portrait"
  ],
  "殻": [
    "coquille",
    "enveloppe (grain)"
  ],
  "享": [
    "recevoir",
    "accepter",
    "répondre (téléphone)",
    "prendre",
    "obtenir"
  ],
  "藩": [
    "clan",
    "fief",
    "domaine"
  ],
  "鶏": [
    "poule"
  ],
  "嘱": [
    "charger de",
    "appartenir",
    "demander",
    "envoyer un message"
  ],
  "迭": [
    "transférer",
    "alternance"
  ],
  "椎": [],
  "陪": [
    "respect",
    "suivre",
    "accompagner",
    "assister"
  ],
  "剖": [
    "disséquer",
    "diviser"
  ],
  "譜": [
    "partition",
    "musique",
    "note",
    "portée",
    "liste",
    "généalogie"
  ],
  "淑": [
    "gracieux",
    "doux",
    "pur"
  ],
  "憤": [
    "excité",
    "rancune",
    "indignation",
    "colère"
  ],
  "酌": [
    "servir à boire",
    "hôte",
    "tirer (de l'eau)",
    "louche",
    "pompe"
  ],
  "暁": [
    "point du jour",
    "aube",
    "au cas où"
  ],
  "傑": [
    "grandeur",
    "excellence"
  ],
  "錠": [
    "serrure",
    "chaines",
    "fers"
  ],
  "凌": [],
  "菅": [],
  "漣": [],
  "遷": [
    "transition",
    "changement",
    "déménagement",
    "dégrader (armée, profession)"
  ],
  "峠": [
    "col (montagne)",
    "sommet",
    "crête",
    "(kokuji)"
  ],
  "篤": [
    "intense",
    "gentil",
    "cordial",
    "grave",
    "sérieux",
    "délibéré"
  ],
  "叔": [
    "oncle",
    "tante",
    "frère ou soeur cadets des parents"
  ],
  "堪": [
    "résistance",
    "endurer",
    "supporter",
    "résister"
  ],
  "吟": [
    "versifier",
    "réciter",
    "récital",
    "chant"
  ],
  "崇": [
    "adoration",
    "respect",
    "révérer",
    "culte"
  ],
  "漆": [
    "laque",
    "vernis",
    "sept (shichi)"
  ],
  "岬": [
    "avancée de terre",
    "cap",
    "pointe",
    "promontoire"
  ],
  "礁": [
    "récif",
    "écueil"
  ],
  "屯": [
    "garnison",
    "poste de police",
    "camp militaire"
  ],
  "姻": [
    "conjugal",
    "mariage"
  ],
  "睦": [
    "intime",
    "amical",
    "harmonieux"
  ],
  "閑": [
    "loisirs"
  ],
  "曹": [
    "élève officier",
    "sous-officier",
    "ami",
    "fils de bonne famille"
  ],
  "詠": [
    "composer (un poème)",
    "récitation",
    "poème",
    "chanson"
  ],
  "卑": [
    "humble",
    "ignoble",
    "vil",
    "vulgaire"
  ],
  "鋳": [
    "couler (métal)",
    "frapper (monnaie)"
  ],
  "蔑": [],
  "胆": [
    "vésicule biliaire",
    "courage",
    "cran"
  ],
  "浪": [
    "ondes",
    "vagues",
    "flots"
  ],
  "禍": [
    "calamité",
    "malchance",
    "mal",
    "malédiction"
  ],
  "酪": [
    "produits laitiers",
    "petit-lait",
    "bouillon",
    "jus de fruits"
  ],
  "憧": [],
  "亜": [
    "Asie",
    "suivant",
    "sub-",
    "sous-"
  ],
  "汰": [],
  "梓": [
    "catalpa"
  ],
  "沙": [],
  "匿": [
    "cacher",
    "abriter",
    "protéger"
  ],
  "寡": [
    "très peu",
    "minorité",
    "veuve"
  ],
  "痢": [
    "diarrhée"
  ],
  "坑": [
    "mine",
    "fosse",
    "trou"
  ],
  "藍": [],
  "畔": [
    "levée de terre",
    "digue (rizière)"
  ],
  "唄": [],
  "拷": [
    "torture",
    "tabasser"
  ],
  "廉": [
    "bonne affaire",
    "raison",
    "charge",
    "suspicion",
    "pas cher",
    "point",
    "compte",
    "pureté",
    "honnête",
    "reposé",
    "satisfait",
    "paisible"
  ],
  "謹": [
    "révérencieusement",
    "humblement",
    "discret"
  ],
  "醜": [
    "laid",
    "malpropre",
    "hideux",
    "honteux"
  ],
  "殉": [
    "martyre",
    "se sacrifier",
    "suivre dans la mort"
  ],
  "煩": [
    "anxiété",
    "tourment",
    "souci",
    "douleur",
    "malade",
    "ennuyeux",
    "nuisance"
  ],
  "桟": [
    "échafaudage",
    "traverse",
    "cadre (shoji)",
    "jetée",
    "quai",
    "pont",
    "verrou"
  ],
  "婿": [
    "fiancé",
    "gendre"
  ],
  "罷": [
    "abandon",
    "quitter",
    "se retirer",
    "arrêter",
    "aller"
  ],
  "矯": [
    "rectifier",
    "redresser",
    "corriger",
    "réformer",
    "guérir",
    "contrôler",
    "faire semblant",
    "falsifier"
  ],
  "某": [
    "untel",
    "un certain",
    "cette personne"
  ],
  "漸": [
    "progressivement",
    "en fin de compte",
    "finalement",
    "tout juste"
  ],
  "藻": [
    "algue",
    "lentille d'eau"
  ],
  "妄": [
    "illusion",
    "inutile",
    "sans autorisation",
    "imprudent"
  ],
  "倹": [
    "austère",
    "frugal",
    "économe"
  ],
  "狐": [],
};

// TODO: Allow user to configure these via a wkof settings dialog.
window.__wanikani_bulk_add_kanji_user_synonyms.PREFERRED_SYNONYMS = {
  成: ['consists of'],
};

(function(global) {
  'use strict';

  if (!window.wkof) {
    var script_name = 'WaniKAni Bulk Add Kanji User Synonyms';
    if (
      confirm(
        script_name +
          ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'
      )
    ) {
      window.location.href =
        'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    }
    return;
  }

  var DISABLE_ALL_LOGGING = true;

  // Set this to true when debugging this script.
  var DEBUG = false;

  // Set this to true to delete all user synonyms for unlocked kanji. Be careful!
  var DELETE_ALL_USER_SYNONYMS = false;

  var WANIKANI_DEBUGGING_LEVEL = '1';
  var WANIKANI_ALL_LEVELS = '*';

  // This is limited by the backend
  var MAX_MEANING_SYNONYMS_LENGTH = 8;

  var Log = {
    prefix: '[WKBAKUS] ',
    debug: function(string) {
      if (DISABLE_ALL_LOGGING) {
        return;
      }
      console.debug(Log.prefix + string);
    },
    info: function(string) {
      if (DISABLE_ALL_LOGGING) {
        return;
      }
      console.log(Log.prefix + string);
    },
    warn: function(string) {
      if (DISABLE_ALL_LOGGING) {
        return;
      }
      console.warn(Log.prefix + string);
    },
    error: function(string) {
      if (DISABLE_ALL_LOGGING) {
        return;
      }
      console.error(Log.prefix + string);
    },
  };

  var checkedKanjiCount = 0;

  // Refer to wkof docs at:
  // https://github.com/rfindley/wanikani-open-framework
  wkof.include('ItemData');
  wkof
    .ready('ItemData')
    .then(fetchItemsWithItemDataModule)
    .then(allKanjiChecked)
    .catch(function catchAllRejections(e) {
      Log.error('caught rejected Promise with error: ' + e.stack);
      return Promise.resolve();
    });

  // ---------------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------------

  // Taken from https://github.com/Nicktho/batch-promises/blob/master/index.js
  function batchPromises(batchSize, thenArr, fn) {
    return Promise.resolve(thenArr).then(function(arr) {
      return arr
        .map(function(_, i) {
          return i % batchSize ? [] : arr.slice(i, i + batchSize);
        })
        .map(function(group) {
          return function(res) {
            return Promise.all(group.map(fn)).then(function(r) {
              return res.concat(r);
            });
          };
        })
        .reduce(function(chain, work) {
          return chain.then(work);
        }, Promise.resolve([]));
    });
  }

  function uniqueFilterFn(value, index, array) {
    return array.indexOf(value) === index;
  }

  // Transpiled from https://github.com/sindresorhus/array-differ/blob/master/index.js
  function arrayDiffer(arr) {
    var _ref;

    for (
      var _len = arguments.length,
        values = Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      values[_key - 1] = arguments[_key];
    }

    var rest = new Set((_ref = []).concat.apply(_ref, values));
    return arr.filter(function(x) {
      return !rest.has(x);
    });
  }

  // ---------------------------------------------------------------------------------
  // Promise-returning functions used in the Promise chain initiated by wkof
  // ---------------------------------------------------------------------------------

  function fetchItemsWithItemDataModule() {
    // Refer to ItemData source for options:
    // https://github.com/rfindley/wanikani-open-framework/blob/master/ItemData.js
    return wkof.ItemData.get_items({
      wk_items: {
        options: {
          subjects: true,
          assignments: true,
          review_statistics: false,
          study_materials: true,
        },
        filters: {
          item_type: {
            value: ['kan'],
          },
          level: {
            value: DEBUG ? WANIKANI_DEBUGGING_LEVEL : WANIKANI_ALL_LEVELS,
          },
        },
      },
    }).then(processItems);
  }

  function processItems(items) {
    // For debugging so that you can type
    // window.__wanikani_bulk_add_kanji_user_synonyms.items
    // in the console and see what the items are
    global.items = items;

    var PROMISE_BATCH_SIZE = 5;

    return batchPromises(PROMISE_BATCH_SIZE, items || [], processItem).catch(
      e => {
        Log.error('Caught rejected Promise. ' + e.stack);
        return Promise.resolve();
      }
    );
  }

  function processItem(item) {
    var subject_id = item.id;
    var subject_type = item.object;
    var slug = item.data.slug;

    // Cannot update user synonyms of kanji that are still locked
    if (!item.assignments || !item.assignments.unlocked_at) {
      return Promise.resolve();
    }

    checkedKanjiCount++;

    var builtInSynonyms = ((item.data ? item.data.meanings : null) || []).map(
      function(obj) {
        return (obj.meaning || '').toLowerCase();
      }
    );

    var existingSynonyms = [];
    if (
      item.study_materials &&
      Array.isArray(item.study_materials.meaning_synonyms)
    ) {
      existingSynonyms = item.study_materials.meaning_synonyms;
    }

    var wwwjdicSynonyms = global.SYNONYMS[slug] || [];

    // This combines:
    // - any existing user synonyms
    // - WWWJDIC synonyms
    //
    // Then subtracts:
    // - built-in synonyms
    //
    // Then dedupes.
    //
    // Then sorts.
    var allUserSynonyms = existingSynonyms.concat(wwwjdicSynonyms);
    var synonymsNotBuiltIn = arrayDiffer(allUserSynonyms, builtInSynonyms);
    var finalSynonyms = synonymsNotBuiltIn.filter(uniqueFilterFn).sort();

    if (DELETE_ALL_USER_SYNONYMS) {
      finalSynonyms = [];
    }

    // Unfortunately the backend has a limit to the number of user synonyms.
    // As a simple workaround, let's just truncate the rest.
    // しょうがないよ！
    if (finalSynonyms.length > MAX_MEANING_SYNONYMS_LENGTH) {
      var truncatedSynonyms = finalSynonyms.slice(
        0,
        MAX_MEANING_SYNONYMS_LENGTH
      );
      Log.warn(
        subject_id +
          ': Kanji ' +
          slug +
          ' cannot have more than ' +
          MAX_MEANING_SYNONYMS_LENGTH +
          ' synonyms. Truncating from: ' +
          JSON.stringify(finalSynonyms) +
          ' to: ' +
          JSON.stringify(truncatedSynonyms)
      );
      finalSynonyms = truncatedSynonyms;
    }

    if (JSON.stringify(existingSynonyms) === JSON.stringify(finalSynonyms)) {
      Log.info(
        subject_id +
          ': Kanji ' +
          slug +
          ' already has all WWWJDIC synonyms saved: ' +
          JSON.stringify(finalSynonyms)
      );
      return Promise.resolve();
    }

    if (!window.$ || typeof window.$.ajax !== 'function') {
      Log.error('Browser missing jQuery AJAX support.');
      return Promise.resolve();
    }

    return $.ajax({
      type: 'PUT',
      url: '/study_materials/' + subject_id,
      contentType: 'application/json',
      data: JSON.stringify({
        study_material: {
          subject_type: subject_type,
          subject_id: subject_id,
          meaning_synonyms: finalSynonyms,
        },
      }),
    })
      .done(function() {
        Log.info(
          subject_id +
            ': Kanji ' +
            slug +
            ' updated with synoyms: ' +
            JSON.stringify(finalSynonyms)
        );
        return Promise.resolve();
      })
      .fail(function(jqXHR, textStatus) {
        var errorText = textStatus + ' ' + jqXHR.responseText;
        Log.error(
          subject_id +
            ': Kanji ' +
            slug +
            ' error updating with synoyms: ' +
            JSON.stringify(finalSynonyms) +
            ' ' +
            errorText
        );
        return Promise.resolve();
      });
  }

  function allKanjiChecked() {
    Log.info(
      'Finished ensuring user synonyms are set for all ' +
        checkedKanjiCount +
        ' unlocked kanji.'
    );
    return Promise.resolve();
  }
})(window.__wanikani_bulk_add_kanji_user_synonyms);
