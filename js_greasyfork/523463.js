// ==UserScript==
// @name         Drawaria Word Helper Fixed by YouTubeDrawaria
// @namespace    http://tampermonkey.net/
// @version      2.9.3.1
// @description  A script that shows a list of possible words for the current target word and allows the user to easily input them into the chat. Now with modal accessibility fixes and an instant win button! (Modificado para mostrar siempre palabras)
// @match        https://*.drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @author       Vholran And YouTubeDrawaria + Mejoras de accesibilidad + Modificación por tu solicitud
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523463/Drawaria%20Word%20Helper%20Fixed%20by%20YouTubeDrawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/523463/Drawaria%20Word%20Helper%20Fixed%20by%20YouTubeDrawaria.meta.js
// ==/UserScript==

(($, undefined) => {
    $(() => {
        // --- INICIO: Fix accesibilidad para el modal (Confiando en Bootstrap) ---
        const wordChooserModal = $('#wordchooser');
        if (wordChooserModal.length) {
            wordChooserModal.on('show.bs.modal', function () {});
            wordChooserModal.on('shown.bs.modal', function () {});
            wordChooserModal.on('hide.bs.modal', function () {});
            wordChooserModal.on('hidden.bs.modal', function () {});
        }
        // --- FIN: Fix accesibilidad para el modal ---

        const allWordLists = {
            "en": [
                "about", "acid", "acorn", "act", "actor", "actress", "add", "addition", "address", "aeroplane", "afternoon", "air conditioner", "air", "airbag", "aircraft carrier", "aircraft", "airline", "airport", "alarm clock", "alley", "alligator", "ammo", "ammunition", "angle", "angry", "animal", "ankle", "answer", "ant", "anteater", "antelope", "anvil", "ape", "apple", "apron", "arch", "area", "arm", "armadillo", "armor", "armory", "armpit", "arms", "army", "arrow", "arsenal", "art", "artillery", "ash", "asphalt", "ate", "attack", "aubergine", "auto", "automatic", "automobile", "autumn", "average", "axe", "axis", "baby", "back door", "back", "bacon", "bag", "bake", "balance", "ball", "ballet", "bamboo", "banana", "band", "bar", "barbecue", "barracks", "barrier", "base", "baseball", "basement", "basin", "basket", "basketball", "bat", "bath", "bathing suit", "bathroom", "bathtub", "battery", "battle", "battlefield", "battleship", "bay", "beach", "beachball", "beam", "beans", "bear", "beautiful", "beaver", "bed", "bedroom", "bee", "beech", "beef", "beehive", "beer", "beets", "bell", "belly button", "below zero", "belt", "berries", "berry", "between", "bicycle", "bike", "bikini", "bin", "birch", "bird", "biscuit", "bison", "bit", "bite", "bitter", "black", "blackberry", "blade", "blender", "blinds", "blizzard", "blouse", "blow", "blue", "blueberry", "boar", "board", "boat", "body", "boil", "bolt", "bomb", "bone", "book", "bookmark", "bookshelf", "boot", "border", "bottle", "bow and arrow", "bow", "bowl", "box", "boy", "bra", "brain", "brake", "brakes", "branch", "brass", "bread", "breadcrumbs", "breakfast", "breast", "breath", "brick", "bridge", "bright", "brilliant", "broccoli", "brook", "broom", "brown", "brush", "bucket", "bud", "building", "bulb", "bull", "bullet", "bunny", "buns", "burn", "burst", "bus", "bush", "business", "butter", "butterfly", "button", "buy", "cab", "cabin", "cactus", "cake", "calculator", "calendar", "camel", "camera", "camouflage", "camp", "canal", "canary", "candle", "candy", "cannon ball", "cannon", "canvas", "captain", "car", "card", "cardigan", "carpet", "carriage", "carrot", "cart", "cartoon", "cash", "cat", "catapult", "cattle", "cave", "cavern", "cd-rom", "ceiling", "cellar", "chain", "chair", "chalk", "channel", "chasm", "chat", "cheap", "cheek", "cheese", "chef", "chemical", "cherry", "chess", "chest", "chestnut", "chew", "chick", "chicken", "chief", "chili", "chimney", "chin", "chips", "chisel", "chocolate", "circle", "circus", "citrus", "clam", "classroom", "clean", "clear", "click", "cliff", "clock", "closet", "cloth", "clothes", "cloud", "cloves", "club", "coach", "coal", "coast", "coat", "cobbler", "cocktail", "coconut", "coffee", "cold", "collar", "color", "column", "comb", "combat", "comedy", "commander", "commercial", "company", "compass", "computer", "concert", "concrete", "conflict", "connect", "connection", "continent", "contrast", "control", "convoy", "cook", "cookbook", "cookie", "copper", "copy", "cord", "cork", "corkscrew", "corn", "corner", "cornflakes", "corridor", "cosine", "costume", "cottage", "cotton", "couch", "cough", "country", "courgette", "court", "cover", "cow", "crab", "crack", "crackers", "crash", "crayons", "cream", "credit", "creek", "crew", "crime", "crisp", "crossing", "crunch", "crush", "crust", "cube", "cucumber", "cuisine", "cup", "cupboard", "cupcake", "currants", "currency", "current", "curtain", "curtains", "curve", "cushion", "cut", "cutlery", "cycle", "cyclist", "cylinder", "dairy products", "dairy", "dance", "dandelion", "danger", "dark", "darkness", "date", "dawn", "deep", "deer", "degree", "delete", "dent", "desert", "desk", "dessert", "destruction", "dial", "diameter", "dictionary", "diet", "digestion", "digital", "dim", "dining room", "dinner", "dip", "direction", "directory", "dirty", "disco", "discussion", "dish towel", "dish washer", "dish", "dishwasher", "display", "distance", "dive", "divide", "diving", "division", "dock", "dog", "doghouse", "doll", "dollar", "dolphin", "dome", "donkey", "donut", "door bell", "door", "doorbell", "doorknob", "doorway", "dough", "down", "downstairs", "drain", "drama", "drapes", "drawer", "dress", "dried", "drill", "drink", "drinks", "drive", "driver", "drop", "drum", "drumsticks", "dry", "dryer", "duck", "dune", "dusk", "dust", "dvd", "ear", "early", "earring", "earth", "east", "eat", "edge", "education", "egg", "eggplant", "elastic", "elbow", "electric", "electronic", "elephant", "eleven", "elk", "ellipse", "elm", "email", "encyclopedia", "enemy", "engine", "english", "enter", "entrance", "entry", "envelope", "equal", "equator", "eraser", "error", "euro", "even", "evening", "exam", "exit", "expansion", "experiment", "eye", "face", "fact", "fall", "fan", "farm", "farmer", "fashion", "fast", "fat", "faucet", "fax", "feast", "feather", "fed", "feet", "female", "fence", "ferret", "ferry", "fiction", "field", "fig", "fight", "film", "finger", "fins", "fir", "fire", "fireplace", "first", "fish", "fishing", "fitness", "fixed", "flag", "flame", "flare", "flash", "flat", "flight", "flood", "floor", "flour", "flower", "fly", "focus", "fog", "fold", "folder", "food", "foot", "football", "force", "forehead", "forest", "fork", "form", "formula", "fort", "foundation", "fountain", "fox", "fraction", "frame", "free", "freezer", "fridge", "friend", "fries", "frog", "front door", "front", "fruit", "fry", "frying pan", "fuel", "full", "furnace", "furniture", "fuse box", "future", "gallery", "game", "gap", "garage door", "garage", "garbage", "garden", "garlic", "gas", "gasoline", "gate", "gear", "general", "geography", "geometry", "get", "geyser", "ginger", "giraffe", "girl", "give", "glacier", "glass", "glasses", "globe", "glove", "gloves", "glue", "goal", "goat", "gold", "golf", "good", "goose", "gps", "grain", "grape", "grapefruit", "grapes", "graph", "grass", "gray", "great", "greater", "green tea", "green", "greens", "grenade launcher", "grey", "grill", "grip", "grizzly bear", "group", "grow", "growth", "guest", "guide", "guinea pig", "guitar", "gull", "gun", "gutters", "gym shoes", "gym", "gymnastics", "hair dryer", "hair", "hairbrush", "half", "hallway", "halo", "ham", "hamburger", "hammer", "hamster", "hand", "handle", "happy", "harbor", "hare", "hat", "hate", "haystack", "head", "headlights", "headline", "healthy", "heart", "heat", "hedgehog", "helicopter", "helmet", "help", "hen", "herbs", "hero", "hi-fi", "high", "highway", "hill", "hinge", "hip", "hippo", "hippopotamus", "history", "hit", "hive", "hockey", "hoe", "hog", "hole", "holiday", "hollow", "home", "homework", "honey", "hook", "hope", "horn", "horse", "hose", "hot sauce", "hot", "hotdog", "hotel", "hour", "house", "hovercraft", "humor", "hundred", "hundredth", "hunger", "hungry", "ice cream", "ice", "iceberg", "icecream", "icicle", "idea", "increase", "ink", "inlet", "inn", "insect", "instrument", "integer", "internet", "interview", "invent", "iron", "island", "ivy", "jam", "jaw", "jeans", "jelly", "jellyfish", "jet", "jewel", "jewellery", "join", "journey", "judge", "jug", "juice", "jump", "kangaroo", "keep", "ketchup", "kettle", "key", "keyboard", "kick", "kid", "kidney", "kilometer", "kind", "kiss", "kitchen", "kiwi", "knee", "knife", "knob", "knot", "koala", "kph", "ladder", "ladle", "lake", "lamb", "lamp", "land", "lane", "language", "laptop", "laser", "laugh", "laundry", "lavatory", "law", "lawn mower", "lawn", "lead", "leaf", "learn", "leather", "left", "leg", "lemon", "lemonade", "lemur", "leopard", "lesson", "letter", "level", "library", "lift", "light switch", "light", "lightning", "lights", "like", "lime", "line", "lion", "lip", "lipstick", "liquid", "list", "liver", "living room", "loaf", "lobster", "lock", "loft", "lollipop", "long", "look", "loop", "loud", "lounge", "love", "low", "lunch", "machine", "magazine", "magic", "mailbox", "maize", "make-up", "male", "mallet", "mammoth", "man", "mango", "map", "maple", "mark", "market", "marmalade", "marshmallow", "mass", "mat", "match", "math", "mathematician", "mathematics", "mayonnaise", "meadow", "meal", "mean", "meat", "meatball", "meatballs", "meatloaf", "medal", "median", "meeting", "melon", "melt", "memorize", "memory", "menu", "merge", "message", "metal", "mice", "microwave", "middle", "midnight", "mile", "mobile phone", "model", "mole", "money", "monkey", "month", "moon", "moose", "mop", "morning", "motion", "motor", "motorcycle", "mountain peak", "mountain", "mouse", "mouth", "move", "mph", "mug", "multiply", "murk", "muscle", "museum", "mushroom", "music", "mussel", "mustard", "nail", "name", "napkin", "narrow", "nature", "neck", "need", "needle", "negative", "neighbour", "nest", "net", "network", "new", "news", "newspaper", "night", "night-vision goggles", "noise", "noon", "north", "nose", "note", "notebook", "null", "number", "nursery", "nut", "oak", "oasis", "oat", "ocean", "octagon", "octopus", "odd", "offer", "office", "oil", "omelet", "onion", "online", "open", "opera", "orange", "orb", "orchestra", "order", "ordinal", "organ", "outdoors", "outlet", "outside", "oval", "oven", "owner", "oyster", "page", "paint", "painting", "palm tree", "palm", "pan", "pancake", "pantry", "pants", "paper", "parabola", "parallel", "parallelogram", "park", "parrot", "part", "pass", "passenger", "passport", "past", "pasta", "paste", "pattern", "pea pod", "pea", "peace", "peach", "peak", "peanut", "pear", "pedal", "pedestrian", "pen", "pencil", "pepper", "percent", "performance", "perfume", "perimeter", "perpendicular", "person", "petrol", "phone", "photo", "photogragh", "physical", "pickaxe", "pickle", "picnic", "picture frame", "picture", "pie", "pig", "pillow", "pilot", "pin", "pineapple", "pinecone", "pinenut", "pink", "pipe", "pizza", "plain", "plane", "planet", "plant", "plate", "play", "playground", "pleasure", "plum", "plus", "pocket", "point", "poison", "polar bear", "police", "polish", "polished", "pond", "pool", "poor", "pop", "popcorn", "popsicle", "pork", "position", "post", "pot", "potato", "potatoes", "powder", "power", "present", "price", "print", "printer", "profit", "program", "programme", "project", "property", "public", "pudding", "puddles", "pull", "pump", "pumpkin", "punch", "punishment", "pupil", "purple", "push", "put", "pyramid", "quality", "question", "quick", "quiet", "rabbit", "radar", "radio", "radish", "radius", "rail", "railway", "rain", "rainbow", "raisin", "rake", "ram", "range", "rank", "raspberry", "rat", "rate", "raw", "ray", "razor", "reaction", "reason", "receipt", "recipe", "record", "recording", "rectangle", "red", "refridgerator", "refrigerator", "relation", "request", "rest", "restaurant", "results", "reward", "rhino", "rhombus", "ribs", "rice", "ride", "right", "ring", "rise", "river delta", "river", "road", "roast", "rock", "rocket", "rod", "roll", "rollover", "romantic", "roof", "room", "root", "rope", "rose", "rough", "round", "row", "rub", "rubbish", "rug", "rule", "ruler", "run", "rye", "safe", "sail", "sailboat", "sailor", "salad", "salmon", "salt water", "salt", "salute", "same", "sand dune", "sand", "sandals", "sandcastle", "sandwich", "sauce", "sausage", "saw", "saxophone", "say", "scale", "scarecrow", "scene", "school", "science", "scissors", "score", "screen", "screw", "screwdriver", "scuba", "sculpture", "scythe", "sea cave", "sea star", "sea", "seafood", "seagull", "seal", "season", "seat", "seaweed", "second", "secret", "secretary", "see", "seed", "self", "sell", "send", "sense", "separate", "serious", "servant", "sesame", "set", "shade", "shadow", "shaft", "shake", "sharp", "sharpener", "sheep", "sheet", "shelf", "shell", "shine", "shiny", "ship", "shirt", "shoe", "shoes", "shoot", "short", "shorts", "shot", "shoulder", "shovel", "shower", "shrimp", "shut", "side", "sign", "silk", "silver", "sine", "sink", "size", "ski", "skin", "skirt", "skunk", "sky", "sled", "sleep", "sleeve", "slice", "slide", "slip", "slope", "slow", "small", "smash", "smell", "smile", "smoke", "smooth", "snack", "snake", "sneeze", "sniper", "snow", "snowball", "snowboard", "snowfall", "snowflake", "snowman", "soap", "sock", "socks", "soda", "sofa", "soft", "software", "soldier", "sole", "solid", "song", "sound", "soup", "sour", "south", "space", "spade", "spaghetti", "spark", "speakers", "speed", "speedometer", "sphere", "spices", "spicy", "spider", "sponge", "spoon", "spray", "spring", "sprinkle", "square", "squash", "squid", "squirrel", "stadium", "stage", "staircase", "stairs", "stairway", "stamp", "star", "starfish", "start", "station", "steak", "steam", "steel", "stem", "step", "steps", "stew", "stick", "sticky", "stiff", "stockings", "stomach", "stone", "stop", "store", "storm", "story", "stove", "straight", "straw", "strawberry", "stream", "street", "strength", "stretch", "strong", "student", "studio", "submarine", "substance", "subtract", "subway", "sugar", "suit", "sum", "summer", "sun hat", "sun", "sunburn", "sunflower", "sunglasses", "sunhat", "sunlight", "sunny", "sunrise", "sunset", "supper", "support", "surf", "surprise", "sushi", "swamp", "sweater", "sweatshirt", "sweet", "swim", "swimming costume", "swimming pool", "swimsuit", "swine", "switch", "symbol", "symmetry", "syrup", "t-shirt", "table", "tail", "take", "talk", "tall", "tan", "tank", "tap", "tape", "taste", "tax", "taxi", "tea", "teacher", "team", "teapot", "teeth", "telephone", "television", "temperature", "tennis", "tent", "terminal", "terrain", "text", "theater", "thick", "thin", "thing", "thought", "thread", "threshold", "throat", "thumb", "thunder", "thunderstorm", "ticket", "tide", "tie", "tiger", "tight", "tights", "time", "tin", "tire", "tired", "toast", "toaster", "toe", "toilet paper", "toilet", "toll road", "tomato", "tongue", "tooth", "toothbrush", "toothpaste", "top", "torch", "touch", "tour", "tourist", "towel", "town", "toy", "trade", "train", "trainers", "tram", "transport", "trash can", "travel", "tray", "tree", "trees", "trick", "trim", "trip", "trousers", "truck", "tsunami", "tub", "tuba", "tummy", "tunnel", "turkey", "turn", "twist", "umbrella", "under", "underground", "underpants", "underwater", "underwear", "union", "unit", "upstairs", "use", "vacation", "vacuum cleaner", "value", "vampire bat", "vanilla", "variable", "vase", "vegetable", "vehicle", "vent", "vertex", "vessel", "vest", "video", "view", "vine", "vinegar", "viola", "violent", "violin", "visit", "vitamin", "voice", "volcano", "volleyball", "volume", "voyage", "wafer", "waffle", "waistcoat", "walk", "wall", "walnut", "walrus", "war", "wardrobe", "warm", "warrior", "wash", "washer", "washing machine", "waste basket", "waste", "watch", "water bottle", "water", "waterfall", "watermelon", "wave", "waves", "wax", "way", "weapon", "weather", "web", "week", "weekend", "weight", "welcome mat", "well", "west", "wet", "whale", "wheat", "wheel", "whip", "whistle", "white", "whiteboard", "wide", "wild", "wildlife", "willow", "win", "wind", "window", "wine", "wing", "winter", "wire", "wise", "wolf", "woman", "wood", "wool", "word", "work", "workbench", "world map", "worm", "wrench", "wrist", "wrong", "x-axis", "x-coordinate", "y-axis", "y-coordinate", "yacht", "yard", "year", "yellow light", "yellow", "yogurt", "yolk", "young", "zebra", "zero", "zoo"
            ].map(word => String(word).toLowerCase()),
            "es": [
                "abajo", "abeja", "abierto", "abismo", "acantilado", "acerca de", "acero", "ácido", "acto", "adición", "agrios", "agua", "agudo", "aguja", "agujero", "aire acondicionado", "ajo", "ala", "alacena", "albóndiga", "alce", "alfiler", "Alfombra de bienvenida", "alfombra", "algas marinas", "algodón", "alimentados", "almacenar", "almeja", "almuerzo", "alto", "amanecer", "amargo", "amarillo", "amigo", "amor", "amortiguar", "amplio", "ángulo", "anillo", "animal", "año", "antílope", "aplastar", "apoyo", "apretado", "apretón", "arándano", "árbol", "arco", "ardilla", "arena", "armadillo", "armario", "arriba", "arroyo", "Arroyo", "arroz", "Art º", "asado", "asiento", "áspero", "aspiradora", "ataque", "atrás", "audición", "aureola", "automático", "avión", "ayuda", "azúcar", "azul", "bahía", "bajo", "ballena", "bambú", "banda", "bandeja", "bandera", "bañera", "baño", "banquete", "bar", "barato", "barbilla", "barra", "barraviento", "base", "basura", "baya", "bebé", "beber", "bellota", "berenjena", "Beso", "biblioteca", "bien", "bisagra", "bisonte", "blanco", "bloquear", "boca", "bocadillo", "bodega", "bola", "boleto", "bolígrafo", "bollos", "bolsillo", "bolso", "bomba", "borde", "bota", "bote de basura", "bote", "botella", "botón", "brazo", "brecha", "brillante", "brillar", "brindis", "brócoli", "bueno", "bulbo", "buque", "Burro", "buzón", "caballo", "cabeza", "cable", "cabra", "cadena", "café", "caja de fusibles", "caja", "cajón", "calabacín", "calabaza", "calamar", "calcetín", "calentar", "calidad", "caliente", "calle", "calor", "calzoncillos", "cama", "cámara", "camarón", "camello", "caminar", "camino", "camisa", "campana", "campo", "canal", "canaletas", "canción", "cangilón", "cangrejo", "canguro", "cansado", "capa", "cara", "caramelo", "carbón", "carne de vaca", "carne", "carril", "carro", "carta", "Casa de perro", "casa", "cascada", "castaña", "castigo", "castor", "caverna", "cebolla", "cebra", "cena", "centeno", "cepillo", "cera", "cerca", "cerdo", "Cerdo", "cerebro", "Cereza", "cerrar", "cesta", "chaleco", "chile", "chispa", "chocolate", "chorizo", "cielo", "ciencia", "ciervo", "circulo", "ciruela", "claro", "clavos de olor", "clima", "coala", "cobre", "cocina", "cocinar", "cocinero", "Coco", "cohete", "cola", "colegio", "colina", "collar", "color", "columna", "comer", "comercio", "comida", "comienzo", "comió", "completo", "conducción", "conducto", "conejillo de indias", "Conejo", "conexión", "congelador", "conservar en vinagre", "continente", "contraste", "controlar", "copos de maíz", "corazón", "corcho", "Cordero", "Correcto", "correr", "corriente", "cortar", "corteza", "cortinas", "corto", "cosa", "costa", "costillas", "crecimiento", "crédito", "crema", "Crema", "crepe", "crimen", "crujido", "crujiente", "cuadrado", "cuadro", "cubrir", "cuchara", "cucharón", "cuchillo", "cuello", "cuenca", "cuenco", "cuerno", "cuero", "cuerpo", "cuesta abajo", "cueva del mar", "curva", "dar", "debajo", "decir", "dedo del pie", "dedo", "delfín", "Delgado", "Derecho", "desagüe", "desayuno", "descanso", "Desierto", "despensa", "destello", "destrucción", "desván", "detener", "diente de león", "dieta", "difícil", "digestión", "dinero", "dirección", "dirigir", "discusión", "disfraz", "distancia", "dividir", "división", "doblez", "Dom", "dormir", "ducha", "dulce", "Duna de arena", "duna", "dupdo", "ecuador", "edificio", "educación", "eje", "Ejército", "elástico", "eléctrico", "elefante", "empresa", "empujar", "enojado", "ensalada", "entrada", "Entrada", "Entre", "entrenadores", "entrenar", "enviar", "equilibrar", "erizo", "error", "escala", "escalera", "escenario", "Escoba", "escritura", "espacio", "espada", "espaguetis", "especias", "espejo", "esperando", "esperanza", "espolvorear", "esponja", "estación", "estaño", "estanque", "estante", "este", "estera", "estofado", "estómago", "estornudar", "estrecho", "estrella", "estufa", "expansión", "extraño", "falda", "feliz", "ficción", "fijo", "filete", "firmar", "físico", "flor", "florero", "formar", "foto", "frambuesa", "fregona", "freír", "freno", "frente", "fresa", "frijoles", "frío", "frotar", "Fruta", "fuego", "fuerte", "fuerza", "fumar", "Fundación", "futuro", "galleta", "Galleta", "galletas", "ganado", "gancho", "garaje", "garganta", "gato", "géiser", "gelatina", "general", "genial", "girasol", "giro", "glaciar", "gofre", "gordo", "grabar", "granja", "grano", "gratis", "grave", "grieta", "grifo", "gris", "grosellas", "grueso", "grupo", "guante", "guardarropa", "guardería", "guerra", "guía", "guisante", "gusano", "gusto", "habitación", "hablar", "Halar", "hambre", "hambriento", "hamburguesa", "hámster", "harina", "haz", "Hazme", "hecho", "helado", "hembra", "hermoso", "hervir", "hielo", "hierba", "hierbas", "hígado", "higo", "hilo", "hipopótamo", "historia", "hogar", "hoja", "hombre", "hora", "hormiga", "hormigón", "hornear", "horno", "hueco", "hueso", "huevo", "humor", "hurón", "iceberg", "idea", "idioma", "igual", "imagen", "impresión", "impuesto", "incluso", "incorrecto", "incrementar", "inmersión", "insecto", "instrumento", "Interruptor de luz", "inundar", "invierno", "isla", "izquierda", "jabón", "jamón", "jarabe", "jardín", "jarra", "jefe", "jengibre", "jirafa", "joven", "joya", "juez", "jugar", "jugo", "kiwi", "la carretera", "la licenciatura", "labio", "lado", "ladrillo", "lago", "lámpara", "lana", "langosta", "lápiz", "largo", "látigo", "latón", "lavabo", "lavadora", "lavandería", "lavar", "lavavajillas", "Leche", "lechería", "lémur", "lengua", "lentes", "lento", "león", "leopardo", "levantar", "leyendo", "libro de cocina", "libro", "liebre", "ligero", "Lima", "límite", "limón", "limonada", "limpiar", "línea", "líquido", "lista", "llama", "llamarada", "llanura", "llave", "lluvia", "lobo", "lona", "lucha", "lucro", "Luna", "maceta", "madera", "magdalena", "maíz", "malvavisco", "mamut", "Mañana", "mango", "mapa", "máquina", "marca", "marco", "Mariscos", "marrón", "martillo", "masa", "masculino", "masticar", "mayonesa", "me gusta", "medianoche", "medio", "mediodía", "melocotón", "melón", "memoria", "mente", "menú", "mercado", "mermelada", "mes", "mesa", "metal", "mezclado", "mía", "miel", "militar", "minuto", "Mira", "mismo", "mojado", "mono", "montaña", "Mora", "mordedura", "morsa", "mostaza", "motor", "movimiento", "mueble", "mujer", "murciélago vampiro", "murciélago", "músculo", "música", "nadar", "naranja", "nariz", "navegar", "necesitar", "negocio", "negro", "nevera", "niebla", "nieve", "niña", "niño", "nivel", "noche", "nombre", "norte", "Nota", "Noticias", "nube", "nudo", "nuevo", "nuez", "número", "oasis", "oblea", "obtener", "Oceano", "odio", "Oeste", "oferta", "oficina", "ojo", "ola", "oler", "orden", "ordenar", "oreja", "oro", "oscuridad", "oscuro", "oso grizzly", "oso hormiguero", "oso polar", "ostra", "otoño", "oveja", "página", "país", "Paja", "pájaro", "pala", "palabra", "palo", "palomitas de maiz", "Pancho", "paño", "pantalones", "pantano", "papas fritas", "papel", "papelera", "paraguas", "paralela", "pared", "parilla", "parte superior", "parte", "partido", "pasado", "pasar", "pasillo", "paso", "pasos", "pastas", "pastel de carne", "pastel", "patada", "patata", "pavo", "paz", "pecho", "pegajoso", "pegar", "peine", "pelo", "pensamiento", "Pepino", "pequeña", "Pera", "Perilla de la puerta", "perro", "persianas", "persona", "peso", "petróleo", "pez", "photogragh", "picante", "picnic", "pico de la montaña", "pico", "piedra", "piel", "pierna", "pimienta", "piña", "pintar", "pintura", "pirulí", "piscina", "piso de arriba", "piso", "pistola", "Pizza", "Placer", "planchar", "plano", "planta", "plata", "plátano", "plato", "playa", "pluma", "pobre", "poco", "poder", "polaco", "pollo", "polvo", "pomelo", "poner", "Popsicle", "popular", "portón", "posición", "postre", "precio", "pregunta", "presente", "primavera", "primero", "productos lácteos", "profundo", "propiedad", "propietario", "protesta", "público", "pudín", "pueblo", "puente", "puerta de la cochera", "puerta principal", "puerta trasera", "puerto", "pulgar", "pulido", "puñetazo", "punto", "quemar", "queso", "químico", "rábano", "ráfaga", "raíz", "rama", "rápido", "rastrillo", "rata", "ratón", "ratones", "rayo", "razón", "reacción", "rebanada", "receta", "recibo", "recogedor", "recompensa", "recortar", "redondo", "refrigerador", "regla", "relación", "reloj", "remolacha", "resbalón", "residuos", "respiración", "respiradero", "responder", "restaurante", "resultsbloquear", "reunión", "rígido", "rinoceronte", "rio Delta", "río", "risa", "ritmo", "rock", "rodar", "rodilla", "rojo", "ropa interior", "rosquilla", "rueda", "ruido", "ruidoso", "sabio", "sacudir", "sala", "salida", "salmón", "salsa de tomate", "salsa picante", "salsa", "saltador", "saltar", "sandía", "Sandwich", "sano", "secadora", "seco", "secretario", "secreto", "seda", "segundo", "seguro", "sello", "semana", "semilla", "sentido", "separar", "serpiente", "servidor", "servilleta", "sésamo", "seta", "silbar", "soda", "sofá", "solicitud", "sólido", "soltar", "sombra", "sombrero", "sonar", "sonreír", "sopa", "soplo", "sorpresa", "sótano", "squash", "suave", "subir", "submarino", "sucio", "suéter", "sur", "Sushi", "sustancia", "tablero", "tamaño", "tarde", "tarifa", "tarjeta", "tarta", "té verde", "té", "techo", "temprano", "tenedor", "terreno", "tetera", "tierra", "Tigre", "tijeras", "timbre de la puerta", "tina", "tinta", "tipo", "tiza", "tocino", "tomar", "tomate", "Topo", "toque", "tornillo", "toro", "tortilla", "tos", "tostadora", "trabajo", "traje de baño", "tramo", "tranquilo", "transporte", "trigo", "truco", "trueno", "tubo de lámpara", "un pan", "uña", "único", "unidad", "unirse", "utilizar", "uva", "vaca", "vaina de guisante", "vainilla", "valor", "vapor", "vaso", "vástago", "vegetal", "vela", "vendaje", "veneno", "ventana", "ventilador", "verano", "verde", "verduras", "vestido", "viaje", "viento", "vinagre", "vino", "violento", "vitamina", "volar", "volcán", "voz", "vuelo", "yarda", "yema de huevo", "yogur", "Zanahoria", "zapatero", "zapatos de gimnasia", "zorrillo", "zorro"
            ].map(word => String(word).toLowerCase()),
            "ru": [
                "порядковый", "шкаф", "виноград", "ножницы", "соединять", "обсуждение", "розовый", "кросовки", "онлайн", "туалет", "ножка", "сэндвич", "запись", "фитнес", "лоб", "потрогать", "значение", "оазис", "женщина", "девятнадцать", "карандаш", "конфликт", "компакт-диски", "карта мира", "сто", "собака", "ток", "голод", "высокий", "синий", "болт", "зебра", "плавать", "чек", "Часы", "турист", "путешествие", "заход солнца", "ключ", "удовольствие", "корабль", "киви", "искра", "боеприпасов", "асфальт", "береза", "ягода", "костюм", "суши", "морская свинка", "плечо", "ритм", "безопасный", "Пальто", "еда", "минус", "надежда", "напитки", "дюна", "морж", "нос", "желудь", "отрицательный", "Телефон", "сухари", "микроволновая печь", "лоток", "шея", "расческа", "учитель", "купальник", "лосось", "кора", "выиграть", "мультфильм", "бетон", "яблоко", "глаз", "плюс", "постель", "машина", "реактивный самолет", "параллельно", "Гаражная дверь", "мебель", "порог", "дыхание", "колготки", "континент", "аэропорт", "пончик", "воск", "часы", "черный", "ручка", "такси", "камин", "стакан", "диаметр", "судья", "свободно", "мусор", "кастрюля", "поездка", "бритва", "миллиона", "Фото", "подмышка", "городок", "темнота", "яд", "галерея", "каретка", "встреча", "дымоход", "пишу", "зефир", "арсенал", "ось", "холодильник", "Ежик", "служащий", "холм", "рыба", "утро", "сияние", "единица измерения", "неправильно", "локоть", "время", "плита", "шина", "шестнадцать", "пустыня", "коврик", "завтрак", "говорить", "зубная щетка", "программа", "удар", "лагерь", "трюк", "десятый", "группа", "звук", "жидкость", "шорты", "тень", "шестерня", "визит", "косинус", "пряный", "ягненок", "борьба", "маленький", "чеснок", "объем", "луч", "угол", "владелец", "февраль", "фиксированный", "портфолио", "бисквит", "рукав", "Работа", "скорость", "крем", "скат", "перекатывать", "магия", "плоский", "луг", "прочность", "служба поддержки", "гроза", "тысяча", "лось", "журнал", "огни", "налог", "олень", "замок", "лифт", "лето", "гвоздь", "быстрый", "смотреть", "фуфайка", "закладка", "проходить", "ребра", "вспышка", "правитель", "гаечный ключ", "транспорт", "кость", "провод", "ваза", "пещера", "слон", "сахар", "плавательный бассейн", "тысячный", "дверь", "справиться", "ластик", "автобус", "щетка для волос", "восемь", "игрушка", "целое число", "поп", "смысл", "марш", "железо", "актер", "каталог", "сказать", "акт", "минут", "мамонт", "сообщение", "карман", "домашнее задание", "чили", "коала", "физическое", "большой палец", "шесть", "муравьед", "серьезный", "сам", "уксус", "день отдыха", "шарнир", "мотыга", "труба", "смеситель", "мягкий", "солнце", "гора", "грудь", "зелень", "Новости", "мелки", "газонокосилка", "автомобиль", "леопард", "фестиваль", "новый", "Кальмар", "морская звезда", "Заголовок", "шоколад", "вкус", "моль", "происхождения",
                "броня", "жесткий", "выход", "нажмите", "прибыль", "мороженое", "темно", "смородина", "кондиционер", "губка", "наводнение", "ко", "ла", "ко", "роткая", "снег", "суп", "меры", "кетчуп", "солдат", "набирать номер", "желе", "месяц", "кувшин", "паук", "порядок", "валюта", "фрикаделька", "резать", "нить", "один", "прихожая", "километров в час", "первый", "телевидение", "помидор", "четыре", "вещь", "летать", "перпендикуляр", "чайник", "башмак", "свет", "фрукты", "цунами", "кислый", "лазер", "гиппопотам", "умножать", "молочные продукты", "почтовый ящик", "громить", "фен", "пистолет", "пеший туризм", "идти", "у-координата", "радиус", "видео", "Омар", "транспортное средство", "ранг", "змея", "назад", "детская площадка", "скульптура", "геометрия", "лимонад", "Топ", "гамбургер", "двенадцать", "причина", "семя", "Попкорн", "серый", "факт", "дискотека", "отдельный", "секретарь", "формула", "сквош", "верблюд", "петля", "электрический", "канарейка", "горчичный", "гостиная", "клуб", "питание", "ботинок", "погружение", "высушенный", "арбуз", "рулон", "лягушка", "острый соус", "черный ход", "платная дорога", "червь", "грузовая машина", "смех", "тур", "передняя дверь", "небо", "цена", "дверной проем", "ресторан", "туфли", "пространство", "столовые приборы", "парусная лодка", "молоток", "губная помада", "желтый", "овца", "вставить", "болотный", "мой", "губа", "сандалии", "сердце", "подводная лодка", "средний", "мокрый", "лодка", "фартук", "проект", "вершина", "масштаб", "внизу", "шерсть", "потолок", "хлеб", "интернет", "денежные средства", "ювелирные изделия", "увидел", "маркеры", "корзина для мусора", "подушка", "говядина", "конвой", "спектакль", "облако", "клавиатура", "нижнее белье", "вознаграждение", "корова", "крыса", "напиток", "делить", "пищеварение", "кокос", "разум", "вмятина", "минеральная", "хмурость", "километр", "рынок", "Кардиган", "ломтик", "тигр", "полоса дороги", "переехать", "воздушная подушка", "удалять", "портьеры", "составить", "Распечатать", "покрытие", "вытащить", "ожидание", "иней", "вафельный", "лук", "редис", "дикий", "ясень", "рис", "боевой", "мясной рулет", "опера", "джинсы", "морозилка", "урок", "солнцезащитные очки", "шлем", "кекс", "ведро", "сливочное масло", "горло", "тренер", "десять", "волк", "лимон", "пицца", "Опасность", "утес", "пылесос", "вверх", "праздник", "снежинка", "макаронные изделия", "лемур", "жирафа", "волосы", "конфеты", "оружейный", "три", "сумма", "доля", "укусить", "цирк", "лиса", "соединение", "концерт", ""
            ].map(word => String(word).toLowerCase())
        };

        // --- Flag global para controlar si el envío de batches está activo ---
        let isInstantWinActive = false;

        // --- Función para detener el envío de batches ---
        const stopInstantWinBatches = () => {
            if (isInstantWinActive) {
                isInstantWinActive = false;
                console.log("[Instant Win Stopper] Envío de batches detenido automáticamente.");
                const $instantWinButton = $('#instantWinButton');
                if ($instantWinButton.length) {
                    $instantWinButton.prop('disabled', false).text('Adivinar Rapido'); // Re-habilitar y resetear texto
                }
                const $hintsBox = $('#hintsBox');
                if ($hintsBox.length) {
                    $hintsBox.prepend('<span style="color: green; font-weight: bold;">Envío de batches detenido.</span><br>');
                }
            }
        };

        // --- Configurar los listeners para detener el envío de batches ---
        const setupInstantWinStopperListeners = () => {
            // Se usa window._io.events porque es la forma de hookear los eventos de Socket.IO del juego.
            // Esto solo funciona si _io y _io.events están disponibles globalmente, lo cual deberían estarlo en Drawaria.
            if (window._io && window._io.events) {
                const eventsToStop = [
                    'mc_turn_wordguessed',   // Cualquier jugador adivina
                    'uc_turn_wordguessedself', // Tú adivinas
                    'bc_turn_results',       // Resultados del turno (palabra adivinada o turno acabó)
                    'bc_turn_abort'          // Turno abortado
                ];

                eventsToStop.forEach(eventName => {
                    // Guardar la función original del evento para llamarla después
                    const originalEventHandler = window._io.events[eventName];
                    window._io.events[eventName] = (...args) => {
                        stopInstantWinBatches(); // Detener el envío de batches
                        if (originalEventHandler) {
                            originalEventHandler(...args); // Llamar a la función original del juego
                        }
                    };
                });
            } else {
                console.warn("[Instant Win Stopper] window._io.events no está disponible. La detención automática podría no funcionar.");
            }
        };

        // --- Helper para generar batches de 99 caracteres (REVERTIDO A LA LÓGICA ORIGINAL DEL SCRIPT 2) ---
        const generateNinetyNineCharBatches = (wordList) => {
            const batches = [];
            let currentBatch = "";
            const maxChars = 99; // Límite de caracteres por mensaje de chat (impuesto por el servidor)

            if (!wordList || wordList.length === 0) {
                console.warn("[Batch Generator] Lista de palabras vacía. No se generarán batches.");
                return [];
            }

            for (let i = 0; i < wordList.length; i++) {
                const word = wordList[i];
                // Si la palabra actual cabe en el batch actual sin exceder el límite
                if (currentBatch.length + word.length <= maxChars) {
                    currentBatch += word;
                } else {
                    // Si no cabe, guardar el batch actual y empezar uno nuevo con la palabra actual
                    batches.push(currentBatch);
                    currentBatch = word;
                }
            }
            // Añadir el último batch si no está vacío
            if (currentBatch.length > 0) {
                batches.push(currentBatch);
            }
            console.log(`[Batch Generator] Generados ${batches.length} batches de ${maxChars} caracteres.`);
            return batches;
        };


        // --- Función principal del panel de ayuda de palabras ---
        let wordCheatPanel = () => {
            // Prevenir la creación duplicada de elementos si la función se llama más de una vez
            if ($('#instantWinButton').length || $('#hintsPanel').length) {
                // console.log("[Drawaria Word Helper] Panel y botón ya existen, omitiendo recreación.");
                return;
            }

            const $sendButton = $('#chatattop-sendbutton');
            const $inputChat = $('#chatbox_textinput');
            const $targetWord = $('#targetword_tip'); // Elemento que muestra la palabra a adivinar (ej. _ _ _ _)
            const $rightBar = $('#rightbar');
            const $hintsBox = $('<span id="hintsBox">');

            let lastGeneratedHints = []; // Almacena las palabras sugeridas para el panel izquierdo (no para el botón de VI)


            const $hintsPanel = $('<div id="hintsPanel" style="display:none; background: #eeeeee; overflow-wrap: anywhere; border: 4px solid #eeeeee; border-radius: 2px; overflow-y: scroll; height: 100%; width:100%; margin: 8px 0 0 0; color: #3675ce;">');
            $hintsPanel.insertAfter($rightBar.children().eq(3)).append($hintsBox);

            // --- INICIO: Botón de Victoria Instantánea (Totalmente Independiente y Toggle) ---
            const $instantWinButton = $('<button id="instantWinButton" style="width:100%; padding: 5px; margin-top: 5px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Adivinar Rapido</button>');
            $instantWinButton.insertAfter($hintsPanel);
            // Habilitar desde el inicio (asumiendo que allWordLists está disponible globalmente)
            $instantWinButton.prop('disabled', allWordLists === null);

            $instantWinButton.on('click', async () => {
                if (isInstantWinActive) {
                    // Si ya está activo, es un clic para DETENER
                    isInstantWinActive = false;
                    $instantWinButton.prop('disabled', false).text('Adivinar Rapido');
                    console.log('[Instant Win] Envío de batches detenido manualmente.');
                    $hintsBox.prepend('<span style="color: green; font-weight: bold;">Envío detenido manualmente.</span><br>');
                    return;
                }

                // Si no está activo, es un clic para INICIAR
                if (!allWordLists) {
                    console.error("[Instant Win] La lista de palabras no está disponible (allWordLists es null).");
                    alert('Error: La lista de palabras no está cargada. Por favor, recarga la página.');
                    return;
                }

                // Determinar el idioma actual del juego
                const gameLang = $('#langselector').val();
                const wordsForLang = allWordLists[gameLang] || allWordLists['en']; // Fallback a inglés

                if (!wordsForLang || wordsForLang.length === 0) {
                     console.warn(`[Instant Win] Lista de palabras vacía para el idioma '${gameLang}'.`);
                     alert(`No se pudo encontrar la lista de palabras para el idioma '${gameLang}'.`);
                     return;
                }

                const batchesToSend = generateNinetyNineCharBatches(wordsForLang);

                if (batchesToSend.length === 0) {
                    console.warn("[Instant Win] No se pudieron generar batches de palabras para enviar. Lista de idioma vacía o palabras muy largas.");
                    alert('No se pudieron generar batches para enviar. Intenta de nuevo.');
                    return;
                }

                console.warn(`[Instant Win] Iniciando envío de ${batchesToSend.length} batches agresivamente. El chat puede congelarse o fallar. ALTA PROBABILIDAD DE SILENCIAMIENTO/DESCONEXIÓN.`);

                $instantWinButton.text('Detener Envío'); // Botón ahora es para detener
                // No deshabilitar el botón, ya que es un toggle

                isInstantWinActive = true; // Activar el flag de envío
                const delayBetweenBatches = 700; // Retraso en milisegundos entre el envío de cada batch

                for (let i = 0; i < batchesToSend.length; i++) {
                    if (!isInstantWinActive) { // Verificar si el flag se ha desactivado
                        console.log("[Instant Win] Proceso de envío de batches interrumpido.");
                        break;
                    }

                    const batch = batchesToSend[i];
                    if ($inputChat.is(':hidden') || $inputChat.prop('disabled')) {
                        console.error('[Instant Win] Chat input no está visible o está deshabilitado. Deteniendo envío.');
                        isInstantWinActive = false; // Desactivar flag si falla el envío
                        break;
                    }
                    $inputChat.val(batch);
                    $sendButton.click();
                    console.log(`[Instant Win Progress] Enviado Batch ${i+1}/${batchesToSend.length}: ${batch.substring(0, 30)}...`);

                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }

                // Finalización del ciclo (ya sea por completar o por interrupción)
                if (isInstantWinActive) { // Si terminó sin interrupción
                    console.log('[Instant Win] Proceso de envío de batches completado. Revisa el chat para el resultado.');
                    $hintsBox.prepend('<span style="color: green; font-weight: bold;">Envío de batches completado. Revisa el chat.</span><br>');
                }
                $instantWinButton.prop('disabled', false).text('Adivinar Rapido'); // Re-habilitar y resetear texto
                isInstantWinActive = false; // Asegurar que el flag esté en false al finalizar
            });
            // --- FIN: Botón de Victoria Instantánea ---

            // --- Handler para palabras clickeadas en la lista de sugerencias ---
            $("body").on('click', '.hintClick', event => {
                $inputChat.val(event.target.innerHTML);
                $sendButton.click();
            });

            // --- Lógica para generar y mostrar sugerencias (panel izquierdo - NO AFECTA AL BOTÓN VICTORIA INSTANTÁNEA) ---
            const assist = () => {
                $hintsBox.empty(); // Limpiar el cuadro de sugerencias primero

                if (!allWordLists) {
                    $hintsBox.append('<span style="color: gray;">Cargando lista de palabras...</span>');
                    lastGeneratedHints = [];
                    return;
                }

                const gameLang = $('#langselector').val();
                const currentLangWordList = allWordLists[gameLang] || allWordLists['en']; // Fallback a inglés

                if (!currentLangWordList || currentLangWordList.length === 0) {
                     $hintsBox.append(`<span style="color:red; font-weight:bold;">Lista de palabras no disponible para '${gameLang}'.</span>`);
                     lastGeneratedHints = [];
                     return;
                }

                const targetWordText = $targetWord.text(); // El texto como "_ _ _ _ _" o "A _ _ L E"

                let hints;
                // MODIFICACIÓN CLAVE: Si la palabra objetivo es genérica o vacía, usa todas las palabras.
                const isGenericPattern = !targetWordText ||
                                         targetWordText.replace(/\s/g, '').replace(/_/g, '').trim() === '' ||
                                         targetWordText.includes('?');

                if (isGenericPattern) {
                    hints = currentLangWordList; // Muestra TODAS las palabras si el patrón es genérico
                } else {
                    // Convertir la palabra objetivo a un patrón regex (ej. "_ _ A _ _" -> "^. . A . . $")
                    const regexPattern = targetWordText.replace(/\s/g, '').replace(/_/g, '.');
                    const wordRegex = new RegExp(`^${regexPattern}$`, 'i');
                    hints = currentLangWordList.filter(word => wordRegex.test(word));
                }

                lastGeneratedHints = []; // Siempre limpiar, esta lista es para el panel

                if (hints.length === 0) {
                    $hintsBox.append('<span style="color:red; font-weight:bold">Lo siento, no se encontró ninguna palabra!</span>');
                } else {
                    $hintsBox.append('<span style="color:green; font-weight:bold">Haz clic en cualquier palabra para enviarla: </span><br>');

                    lastGeneratedHints = hints; // Almacenar las sugerencias para el panel (si se clickean)

                    // Filtrar y ordenar para mostrar primero las que coinciden con la entrada del usuario en el chat
                    const inputVal = $inputChat.val().toLowerCase();
                    let matchingHints = hints.filter(hint => inputVal === '' || hint.toLowerCase().includes(inputVal));
                    let nonMatchingHints = hints.filter(hint => inputVal !== '' && !hint.toLowerCase().includes(inputVal));

                    matchingHints.sort((a, b) => {
                        const aExact = a.toLowerCase() === inputVal;
                        const bExact = b.toLowerCase() === inputVal;
                        if (aExact && !bExact) return -1;
                        if (!aExact && bExact) return 1;
                        return a.length - b.length; // Luego por longitud
                    });

                    let html = matchingHints.map(hint => `<a style="color:#007CFF; background:#C6FE71; user-select:none" href="javascript:void(0);" class="hintClick">${hint}</a>`).join(', ');
                    if (nonMatchingHints.length > 0) {
                        html += ', ' + nonMatchingHints.map(hint => `<a style="background:none; user-select:none" href="javascript:void(0);" class="hintClick">${hint}</a>`).join(', ');
                    }

                    $hintsBox.append(html);
                }
            };

            $inputChat.on('input', assist); // Actualizar sugerencias del panel al escribir en el chat

            // --- Observadores para la visibilidad y actualización de la palabra objetivo (para el panel y botón) ---
            const targetWordElem = $targetWord[0]; // Referencia al elemento DOM del patrón de la palabra
            const hintsPanel = $('#hintsPanel');

            if (targetWordElem) {
                const wordTipObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        // El panel y el botón se ocultan SOLO si el display de targetWord_tip es 'none'.
                        // Permanecen visibles si el contenido es '?' o '_ _ _ _'.
                        const isTargetWordHiddenCompletely = targetWordElem.style.display === 'none';
                        if (isTargetWordHiddenCompletely) {
                            //nothing happens because I want the menu allways visible
                        } else {
                            hintsPanel.show();
                            $instantWinButton.show();
                            assist(); // Re-generar sugerencias del panel al aparecer/cambiar la palabra objetivo
                        }
                    });
                });
                wordTipObserver.observe(targetWordElem, { attributes: true, attributeFilter: ['style'], childList: true, subtree: true });
            }

            // Observador para el botón de refrescar palabra (se habilita cuando hay nueva palabra)
            const refreshListElem = $('#wordchooser-refreshlist')[0];
            if (refreshListElem) {
                const refreshWordObserver = new MutationObserver((mutations) => {
                    if (mutations[0].target.disabled === false) {
                        setTimeout(assist, 50); // Dar un pequeño respiro para que el DOM se actualice y el panel se actualice
                    }
                });
                refreshWordObserver.observe(refreshListElem, { attributes: true });
            }
        };

        // --- Activadores al inicio ---
        // 1. Setup del Instant Win Stopper (se ejecutará una vez al inicio del script)
        setupInstantWinStopperListeners();

        // 2. Iniciar el panel de ayuda y los observadores cuando se detecte que la sala es de adivinanza de palabras
        //    La lista de palabras ya está hardcodeada (allWordLists), por lo que está disponible instantáneamente.
        const roomKeywords = /\слов|Palabras|Word/;
        const infotextElement = $('#infotext')[0];
        if (infotextElement) {
            const infotextObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (roomKeywords.test(mutation.target.textContent)) {
                        wordCheatPanel(); // Iniciar el panel y sus lógicas

                        // FORZAR la llamada a assist() inmediatamente después de que el panel se inicialice.
                        // Esto asegura que la lista se muestre al instante, sin esperar un cambio de estilo.
                        setTimeout(() => {
                           const $targetWord = $('#targetword_tip');
                           // Asegurarse de que el panel esté visible si targetWord_tip no está oculto
                           if ($targetWord.length && $targetWord.css('display') !== 'none') {
                               $('#hintsPanel').show();
                               $('#instantWinButton').show();
                               // Ejecutar assist para llenar el panel con palabras
                               assist();
                           }
                        }, 100); // Pequeño retraso para asegurar que los elementos estén renderizados

                        infotextObserver.disconnect(); // Desconectar el observador una vez activado
                    }
                });
            });
            infotextObserver.observe(infotextElement, { childList: true, subtree: true });
        }
    });
})(window.jQuery.noConflict(true));