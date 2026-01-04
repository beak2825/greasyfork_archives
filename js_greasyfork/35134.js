// ==UserScript==
// @name         listafiltro1
// @namespace    listafiltro1
// @description  Filtra los hilos no deseados por palabras clave y autores. Código de badjojo, editado con lista de términos y usuarios a filtrar para eliminar trolls, política, deportes, PC master race, spoilers, NSFW, criptomonedas, coronavirus y demás temas repetitivos. Uso personal.
// @include      *.forocoches.com/
// @include      *.forocoches.com/foro/forumdisplay.php*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @icon         https://i.imgur.com/QlWA4Kx.png
// @version      2.15.26
// @downloadURL https://update.greasyfork.org/scripts/35134/listafiltro1.user.js
// @updateURL https://update.greasyfork.org/scripts/35134/listafiltro1.meta.js
// ==/UserScript==



// Palabras a filtrar:
var palabras = ['Peña','GoT', '"GoT"?', 'Mercadona', 'mercadona', 'MERCADONA', 'PLATAFORMA', 'CULER', 'Cersei', 'Cercei', 'Jon Nieve', 'Jon Snow', 'jon nieve', 'jon snow', 'Lannister', 'Juego de tronos', 'Game of thrones', 'corea', 'korea', 'islam', 'islámico', 'islámica', 'yihadista', 'yihadistas', 'Pantumaker', 'Albert Rivera', 'Rajoy', 'PP', 'PSOE', 'pablo iglesias', 'beta', 'rufian', 'Rufián', 'fútbol', 'futbol', 'Futbol', 'Fútbol', 'FUTBOL', 'FÚTBOL','Cristiano', 'Cristianos', 'CRISTIANO', 'CRISTIANOS', 'Ronaldo', 'ronaldo', 'RONALDO', 'MESSI', 'Messi', 'messi', 'catalán', 'CATALÁN', 'catalan', 'catalán', 'Catalán', 'CATALAN', 'Catalan', 'Cataluña', 'cataluña', 'CATALUÑA', 'catalanes', 'Catalanes', 'CATALANES', 'Catalunya', 'catalunya', 'CATALUNYA', 'sumar mensajes', 'sumar hilos', 'Murcia', 'MURCIA', 'murcia', 'doble nacionalidad', 'DOBLE NACIONALIDAD', 'moro', 'moros', 'Moro', 'MORO', 'MOROS', 'Moros', 'mora', 'MORA', 'Daenerys', 'DAENERYS', 'daenerys', 'Targaryen', 'TARGARYEN', 'targaryen', 'Piqué', 'PIQUÉ', 'Real Madrid', 'Barça', 'barça', 'BARÇA', 'el barcelona', 'el Barcelona', 'EL BARCELONA', 'El barcelona', 'El Barcelona', 'el BARCELONA', 'El BARCELONA', 'el madrid', 'El madrid', 'EL MADRID', 'el Madrid', 'el MADRID', 'ROCOSOS', 'ROCOSO', 'rocoso', 'Rocoso', 'rocoso', 'rocosos', 'tds', 'pts', 'TDS', 'PTS', 'Death Note', 'death note', 'PREMIUM', 'premium', 'Premium', 'musulmanes', 'Musulmanes', 'MUSULMANES', 'Tyrion', 'Theon', 'theon', 'greyjoy', 'Greyjoy', 'Sansa', 'sansa', 'arya', 'Arya', 'Stark', 'stark', 'la montaña', 'La montaña', 'Clegane', 'clegane', 'LA MONTAÑA', 'La MONTAÑA', 'la MONTAÑA', 'sudamericanos', 'Sudamericanos', 'SUDAMERICANOS', 'Villarato', 'VILLARATO', 'villarato', 'fichaje', 'FICHAJE', 'Florentino', 'florentino', 'dembele', 'dembelé', 'DEMBELE', 'Dembele', 'Dembelé', 'DEMBELÉ', 'asensio', 'Asensio', 'ASENSIO', 'Kroos', 'kroos', 'Rakitic', 'rakitic', 'Modric', 'modric', 'gym', 'GYM', 'mohameds', 'Mohameds', 'Carmena', 'Xiaomi', 'iPhone', 'Apple', 'FACHAS', 'FACHA', 'corrupción', 'corrupcion', 'sharia', 'Sharia', 'ADELGAZA', 'VOL', 'Recopilatorio', 'MASTER RACE', 'multiculturalidad', 'multicultural', 'Electrik', 'cuñaos', 'CUÑAO', 'Mi hilo', 'Generalitat', 'CUP', 'Macron', 'Alberto Contador', 'FORONIÑOS', 'progres', 'Mossos', 'OFERTAS', 'REFERIDOS', 'estelada', 'madridismo', 'barcelonismo', '2 vasos de agua', 'MUSLIMS', 'SANTIAGO BERNABEU', 'Coutinho', 'AZNAR', 'CASO JUANA', 'morito', 'ISIS', 'ISCO', 'JUDIOS', 'Sexta', 'Rotodos', 'Juana Rivas', 'terroristas', 'Vox', 'FEMINISMO', 'El hilo de', 'Colau', 'PODEMOS', 'transgénero', 'Nacionalismo', 'bisexual', 'Independencia', 'feminista', 'constitución', 'VioGen', '1-O', 'BREXIT', 'independicemos', 'Hacienda', 'ETNIA', 'S O R T E O', 'CUERPOESKOMBRO', 'ARRIMADAS', 'bilis', 'Cristina Pardo', 'INDEPES', 'Puigdemont', '2 de octubre', 'Hilo para', 'OTEGUI', 'Coscubiela', 'Echenique', 'indepe', 'SORTEO', 'feminazi', 'iOS', 'Android', 'FRANCO', 'Zidane', 'CR7', 'Instagram', 'BENZEMA', 'Juana', 'Sextete', 'Girona', 'madris', 'flor', 'MADRID', 'Bernabéu', 'theo', 'vete ya', 'Vete ya', 'CEBALLOS', 'banquillo', 'Jajajaja', 'la liga', 'JUANEANDO', 'combinada', 'TRIPLETE', 'Madrilistos', 'Partidazo', 'Ausencio', 'ARENAVISION', 'Marcelo', 'PDeCAT', 'Rita Maestre', 'podemitas', 'Irene Montero', 'George RR Martin', 'Forocuñados', 'el Jueves', 'Assagne', 'Assange', 'FORCADELL', 'DIADA', 'tanques', 'comunistas', 'català', '@xavier2012', 'CHOLLO', 'rebajas', 'Casillas', 'Manolo Lama', 'Marca', 'fascistas', 'Junqueras', 'PES 2018', 'Luis Suarez', 'referéndum', 'Otegi', 'James', 'Govern', 'REFERENDUM', 'CONJUNTA', 'EJERCITO', '13tv', 'autonomía', 'Soraya', 'MORDAZA', 'LGTBI', 'FIFA', 'GARZÓN', 'Abascal', 'HAWKERS', 'HIPNOTIZAME', 'margallo', 'Robo a', 'Robo al', 'REAL SOCIEDAD', 'Cantera', 'Botín', 'Garzon', 'Wyoming', 'WYOMING', 'Guardia Civil', 'Oficial', 'Iglesias', 'Mugremitas', 'democracia', 'gobierno', 'TV3', 'civiles', 'policías', 'Sol', 'Gran Hermano', 'VOTAR', 'LOL', 'Liga', 'musulman', 'transexual', 'vascos', 'fascismo', 'UCAM', 'El País', 'FC Barcelona', 'INTERECONOMIA', 'betis', 'Betis', 'Culés', 'Chiringuito', 'Rivera', 'FROILÁN', 'BERNABEU', 'madrit', 'imparapla', 'A7', 'A5', 'A4', 'la GC', 'Guerra Civil', 'EL BICHO', 'el Rey', 'Dmocracia', 'Cifuentes', 'Mosso', 'congreso', 'PRESIDENT', 'MARIANO', 'Kim', 'Trump', 'CORRUPTA', 'spoilers', 'política', 'manifestación', 'Policía', 'coleta', 'políticos', 'Bescansa', 'derechista', 'franquismo', 'Luís Suárez', 'Falange', 'Penalti', 'alaves', 'Estelades', 'FASCISTA', 'mosos', 'ejército', 'cañon', 'CAÑÓN', 'la consulta', 'socialismo', 'comunismo', 'DIEGO COSTA', 'separatismo', 'ESPAÑOLISMO', 'FACHILLLAS', 'RIBERA', 'MUGRE', 'IZMIERDAS', 'igualdad', 'de estado', 'LaSecta', 'Afectados por', 'el Valencia',' CHARLOTTESVILLE', 'NEONAZI', 'GAY', 'Indepandancia', 'franquistas', 'extrema derecha', 'CIUDADANOS', 'Pedro Sanchez', 'sobre España', 'PEDRO SÁNCHEZ', 'SEPARRATAS', '@Kotaro', '@kotaro', 'ESPAÑA', 'BANDERA', 'BANDERAS', 'patriótica', 'española', 'ROJIGUALDA', 'MADRlD', 'españoles', 'homosexuales', 'Suarez', 'iglesia', 'catolica', 'POLÍTICO', 'ATLETI', 'Wanda', 'CHAMPIONS', 'POLICIA', 'LEAGUE OF LEGENDS', 'Derechos Humanos', 'ONU', 'Bayern', 'Ancelotti', 'CUÑADO', 'urnas', 'PAPERETES', 'izquierdas', 'MYHYV', 'BETFAIR', 'BOICOT', 'INDAPANDENT', 'aborto', 'Compromís', 'inda', 'Inda', 'Marroquí', 'ANC', 'tractorada', 'burka', 'anticonstitucional', 'concentraciones', 'vegano', 'separatista', 'Espanya', 'PSG', 'Golazo', 'neymar', 'VEGANISMO', 'bet365', 'Nos vamos a la mierda', 'SOBREVALORADO', 'PATRIOTAS', 'TRACTORES', '1-0', 'CTLÑ', 'la poli', 'manifestacion', 'FFCCSS', 'legalidad', 'ENRIC VILAS', 'CNP', 'MANIPULACIÓN', 'urna', 'puajdemont', 'GUARROS', 'XAVI', 'pugdemont', 'Ferreras', 'picapleitos', 'Art. 155', 'pelota de goma', 'dictadura', 'La secta', 'Arsenal', 'He votado', 'democratico', 'Pique', 'Estatut', 'NAZI', 'escrutinio', 'Los votos', 'Ada Colao', 'YUNG BEEF', 'artículo 155', 'Twitter', 'lliure', '155', 'agresión sexual', 'Caixa', 'Sabadell', 'REPUBLICA', 'INDENPENDENTISTAS', 'Mascherano', 'estado de derecho', 'democrático', 'DUI', 'MILITARIZADO', 'BCN', 'PUYOL', 'Dalas', 'Parlament', 'Constitucional', 'butifarrendum', 'youtubers', 'youtuber', 'Trapero', 'TRAPERO', 'derechas', 'Wismichu', 'de derecha', 'extremistas', 'Hamilton', 'Alonso', 'podemita', 'manifestantes', '8-O', 'banderita', 'UPYD', 'mugroso', 'manifa', 'la izquierda', 'Puigdemon', 'DIU', 'Puigde', 'Puchimon', 'Puidgemont', 'Puchemont', 'In Dependencia', 'Pudermont', 'pudgi', 'pelomocho', 'PUCHI', 'Tejero', 'Puikdemón', 'Puichdemón', 'PUSHDEMON', 'PIDGEOTTO', 'catalufos', '1 DE OCTUBRE', 'SEPA-RATAS', 'sepa rata', 'pigdemont', 'Santamaría', 'catalonia', 'ESPAÑOLISTAS', 'SOBREVALORADA', 'Anna Gabriel', 'Separatas', 'GUARDIOLA', 'JORDIS', 'CUÑADAS', 'detector de', 'DETECTOR DE', 'Jordi', 'JDT', 'A qué huelen', 'A qué huelen', 'A que huele', 'junts pel si',' LQSA', 'Maruny', 'Biwenger', 'PEPEROS', 'RIVERITOS', 'Juntxsi', 'elecciones', 'huelga', 'BEEF', 'Luis Suárez', 'legionario', 'STRANGER', 'THINGS', 'Spoiler', '+Spoiler', 'camp nou', 'BARSA', 'TUENTI', 'PEPEPHONE', 'COMUNISTA', 'NINTENLERDOS', 'GErona', 'Marc Márquez', 'INMIGRACIÓN', 'Politicos', 'CORRUPTOS', 'Manada', 'No FAP', 'La Reconquista', 'California', 'Ceballoooooos', 'violencia de género', 'violación', 'Cocomocho', 'presunción de inocencia', 'Barbijaputa', 'tangana', 'anime', 'calvos', 'calvo', 'BITCOIN', 'MALTRATADOR', 'Bitcoins', 'IOTAs', 'IOTA', 'intifada', 'INTIFADA', 'Herbalife', 'africanos', 'árabe', 'Bytecoins', 'minar', 'sexista', 'criptos', '@Tonto', 'JESE', 'LÉRIDA', 'Mongolia', 'ACOSO', 'Star Wars', 'STAR WARS', 'Skywalker', 'SKYWALKER', 'SNOKE', 'Snoke', 'RACISTA', 'Compromis', 'TAXIS', 'cripto', 'HIVE', 'criptomonedas', 'Litecoin', 'ETNlA', 'Ethereum', 'misógino', 'FOROMISOGINOS', 'FC. Barcelona', 'Switch', 'ethers', 'wabi', 'ciclistas', 'delito sexual', 'Dembélé', 'bombero', 'Bombero', 'coinbase', 'starwars', 'iMAC', 'DOBLE VARA', 'MASS MEDIA', 'VIOLACIONES', 'abusos', 'BUNNY', 'REFUGEES', 'refugiados', 'PS4', 'Xbox', 'SEXUALMENTE', 'FOROCATÓLICOS', 'cosplay', 'kyloren', 'PCmaster', 'Arandina', 'Zelda', 'Aranda', 'Progre', 'follawaifus', 'SW', 'ROGUE', 'Clan', 'Clash', 'Leia', 'Han Solo', 'Luke', 'STAR', 'Chewbacca', 'R2D2', 'Milenario', 'Imperial', 'NINTENDO', 'homeopático', 'Andina', 'procés', 'Iceta', 'Pedroche', 'DISNEY', 'MARVEL', 'Kepa', 'Athletic', 'antifascistas', 'crypto', 'extrema izquierda', 'Ciutadans', 'DUDU', 'Susana', 'vegana', 'Xtrabytes', 'antifascisfas', 'Zaza', 'calvo', 'sexo débil', 'Fachillas', 'TRX', 'judío', 'Pep', 'el City', 'Premier', 'Montoro', 'Kraken', 'RotoCoins', 'Lainez', 'Portuaris', 'Victor', 'Rodrigo Lanza', 'Víctor', 'IMMIGRANTES', 'SERGIO RAMOS', 'Arturo mas', 'Gitanos', 'Rubén Castro', 'Akuya', 'UFO Coin', 'Coin', 'PesetaCoin', 'heteropatriarcado', 'Jedi', 'jedi', 'jedis', 'Jedis', 'Ciclista', 'Láinez', 'INIESTA', 'Kenobi', 'Binks', 'C3PO', 'C3P0', 'Kylo', 'Mundial de Clubs', 'politico', 'ideologia', 'ideología', 'minergate', 'Derby', '21-D', 'Iguandad', 'SILENCIADOS', 'mino', 'Millenials', 'A.C. Milan', 'CAVA', 'GIIIIIII', 'consentida', 'SENY', 'Farsa', 'VALORS', 'OTACO', 'El mensaje', 'el mensaje', '.cat', '.CAT', 'os vais a dar', 'Menuda ostia', 'CARLES MUNDÓ', 'CALBO', 'follawaifu', 'machismo', 'VILLAR', 'CORRUPTO', 'APUESTAS', 'alopecia', 'musulmán', 'bitfinex', 'exchange', 'MALTRATO', 'lotería', 'loteria', 'HOMOSEXUALIDAD', '21D', 'votantes','PCS', 'tripartito', 'Oslofo', 'Kinder', 'que OSTIA', 'se van a dar', 'transfoba', 'fobia', 'okupa', 'FORERAS', 'Ildefonso', 'el clásico', 'el Clásico', 'supercopas', 'SHURAS', 'Unionistas', 'BALONES DE ORO', ' NWO', 'los cules', 'TOUS', 'politic', 'del real', 'goleada', 'corner', 'STEGEN', 'Ter ', 'demócrata', 'waifu', 'Tabarnia', 'tabarnia', 'Revilla', ' ALFA ', 'AMAZON', 'Amazon', '[CAT]', 'Artadi', ' ETA', 'sindica', 'Senado', 'Darth', 'Vader', 'ERREJÓN', 'Suecia', 'la CNT', 'La Meca', 'Goin ', 'masterrace', 'Nido de', 'imigrantes', 'Carcaño', 'viola', 'AISLADO', 'Stalin', ' trans ', 'Netflix', 'NETFLIX', 'Tinder', 'TINDER', 'JUDIO', 'hetero ', 'trap', 'chivato', 'chivatos', 'cabalgata', 'bittrex', 'A POBRA', 'Cabalgata', 'patoaventuras', 'Patoaventuras', 'DIENTES', 'soplón', 'LGTB', 'Ramadán', 'Diana Quer', 'Queer', 'First Dates', 'ILITRI', 'Drac Queen', 'forero medio', 'Reyes Magos', 'drag queens', 'DRAGS', 'Charro', 'charro', 'LEND', 'TRON', 'hinna', 'Hinna', 'HINNA', 'Zombicat', 'zombicat', 'ZOMBICAT', 'religiones', 'LATIUM', 'ICO ', 'Monedero', 'PC Gamer', 'LINUX', 'UBUNTU', 'AP-6', 'cáncer', 'Cáncer', 'Venezuela', 'DE ODIO', 'feminaz', 'Tortilla con', 'tortilla con', 'tortilla sin', 'Tortilla sin', 'contacto cero', 'Gurtel', 'Racismo', 'anarquismo', 'TROTILLA DE PATATAS', 'VIOLENCIA', 'MACHISTA', 'BTC', 'CATÓLICA', 'Mi EX', 'paja ala crema', 'Al carrer', 'al carrer', 'Lega ', 'Leganés', 'Valverde', 'VALVERDE', 'Espanyol', 'javascript', 'SUVs', 'DACIA', 'ANA PASTOR', 'Jesé', 'balón de oro', 'pederasta', ' trans ', ' GC ', 'Teresa Rodríguez', 'ridícul', 'històric', 'Ylenia', 'Echegui', 'holocausto', 'dianaquer', 'terrorista', 'Alcasser', 'DISCRIMINACIÓN', 'conseller', 'el Español', 'Vascongadas', 'ESPAÑOOOOOOOOOOL', 'SAMUS', 'MEGAZORD', 'Cassandra', 'Cassandro', 'CALVICIE', 'gusana', 'Salvados', 'Portavozas', 'Borbon', 'Borbón', 'Musk', 'Adicta', 'AMUNT', 'feto', 'Leticia Dolera', 'tweet', 'LESBIANA', 'Gol ', 'Magselo', 'Emery', 'Gaaaaa', 'roja directa', 'calva', 'Minear', 'arbitro', 'neyma', 'el robo', 'Emeri', 'Al-Khelaifi', 'Mbaqué', 'árbitro', 'Vasco', 'vasco', 'Jehová', 'Siria', 'Kurdo', 'euskera', 'Krauss', 'ATEO', 'toros', '016', 'comentaristas', 'Ana Gabriel', 'perroflauta', 'Le Pen', 'DIBUGITOS', 'XINOS', 'Churrero', 'sindrome', 'Down', 'ULTRAS', 'católico', 'BNEXT', 'OLDFAG', 'HOMO', 'ultraderecha', 'AFD', 'Chelsea', 'Leganes', 'HITLER', 'bici', 'ANDALUZ', 'Heck', 'CALENTACUENTO', 'acosador', 'Malaga CF', 'Molinón', 'FARIÑA', 'Misoginia', 'MUNDO se PARA', 'in ELLAS', 'Nijar', 'TORTILLA DE PATATA', 'Magikarp', '8M', 'MASCULINIDAD', 'fororetrasados', 'foroamargados', 'monstserrat', 'Montserrat', 'liberal', 'YoParo', 'elmundo.es', 'dia de la mujer', 'paralizado el mundo', 'paralizó el mundo', 'pensiones', 'mi cumpleaños', 'vapeo', 'reivindican', 'ser TODAS', 'mujer checa', 'susanita', 'espejo publico', 'ATTWHORE', 'brechasalarial', 'MyProtein', 'forocochero medio', '8-M', 'METOO', 'más mujeres que', 'día de la mujer', 'la MUJER', 'La mujer', 'hipócritas', 'white knight', 'Las mujeres', 'Negra', 'NEGRA', 'negra', 'Gabriel', 'Dominicana', 'DOMINICANA', 'Níjar', 'C´s', 'Casemiro', 'Busquets', 'Kane', 'ANDRÉ', 'GOMES', 'MAN.U', 'MOU?', 'al SEVILLA', 'Alexelcapo', 'prisión', 'Prisión', 'PRISIÓN', 'prision', 'Prision', 'PRISION', 'permanente', 'Permanente', 'PERMANENTE', 'revisable', 'Revisable', 'REVISABLE', 'Ana Julia', '1ª División', 'porros', 'capitalismo', 'COURTOIS', 'PARTIDO', 'Grabiel', 'JFK', 'MR', 'OKDIARIO', 'veves', 'Sergi Roberto', 'Fortnite', 'UEFA', 'al Barcelona', 'NEGRO', 'Mbaye', 'Ndiaye', 'PENYA', 'CARVAJAL', 'Marta Rovira', 'MARTA ROVIRA', 'pantuma', 'prucés', 'Ecologistas', 'Aurah', 'Nyan', 'wallapop', 'Wallapop', 'blume', 'Blume', 'otaku', 'rubius', 'Rubius', 'procesion', 'procesión' ,'Ramadan', 'Ramadán', 'Santa', 'LETIZIA', 'Reina', 'la ROMA', 'meacolonias', 'Liverpool', 'azo amarillo', 'onarquía', 'epública', 'Leticia Vs Sofía', 'Los alemanes', 'Simón Perez', 'tipo fijo', 'Soros', 'demont', 'PUSDEMON', ' UE*', ' UE ', 'Spainexit', 'Mcgregor', 'McGregor', 'DEPOR', 'Depor', 'ERC', 'perpetua', 'Alerta Digital', 'AlertaDigital', 'atentado', 'ATENTADO', 'Alerta digital', 'LLARENA', ' PDR ', ' SCHZ ', 'IRPF', 'DGT', 'Leonor', 'Sofía', 'infanta', 'Gol', 'Rooo', 'MANOLA', ' gal ', 'remat', 'CDR', 'terrorismo', 'ROBO', 'ATRACO', 'mandriles', 'REY de Europa', 'Penaa', 'penaa', 'penalti', 'Penalti', 'repetici', 'Llorad', 'Juve', 'Shempions', 'mpions', 'lucas vazquez', 'adrones', 'jeje', 'penaldo', 'ernabeu', 'Siuu', 'amarilla', 'Benatia', 'billis', 'Buffon', 'abitro', 'Me presento', 'descuento', 'NEGACiONISTAS', 'NEGACIONISTAS', 'penal', 'Penta', 'ME DESPIDO', 'Ebro', 'Múrcia', 'contacto 0', 'huawei', 'matriarcado', 'Rusia', 'Guerra', 'PUTIN', 'Putin', 'ALSASUA', 'Alsasua', 'guardia', 'eparat', 'BALE', 'SALAH', 'alah', 'rovira', 'neandertal', 'guantanamo', 'crack', 'cárcel', 'forococh', 'APLAUDIR', 'sentencia', 'Arcadi', 'nfinity', 'jaj', 'aja', 'ajj', 'jja', 'jjj', 'aaj', 'jaa', 'JAJ', 'AJA', 'AJJ', 'JJA', 'JJJ', 'AAJ', 'JAA', 'eylor', 'veo MANO', 'delito', 'LIDL', 'MAPFRE', 'ilegal', 'Eurovision', 'Eurovisión', 'Alfred', 'Amaia', 'Gooo', 'ooo', 'ARBlTRO', 'Cule', 'Rallo', 'FCB', 'LUCAS VÁZQUEZ', 'Mundial', 'mundial', 'MUNDIAL', 'Lopetegi', 'opetegui', 'opetegi', 'KOKE', 'seleccion', 'Karius', 'KARIUS', 'karius', 'culé', 'Ramos', 'gobierna', 'MOCION', 'Moción', 'Mocion', 'moción', 'mocion', 'MOCIÓN', 'Bildu', 'Oltra', 'EUSKAL', 'ABUSO', 'Acosaron', 'Biblia', 'crucifijo', 'Pedrito', 'Felipe', 'cruzcampo', 'quarius', 'QUARIUS', 'Jorge Lorenzo', 'tapando bocas', 'callando bocas', 'DE GEA', 'De Gea', 'de gea', 'fuera de juego', 'Becky', 'selección', 'Portugal', 'De Fea', 'HIERRO', 'Hierro', 'Silva', 'VAR', 'PRIMEROS DE GRUPO', 'MERENG', 'ay mano', 'mano de', 'Maradona', 'SOCCER', 'Bartra', 'TIRADO a PUERTA', 'tikitaka', 'Camacho', 'posesi', 'pases', 'fracaso', 'culpa', 'FRACASO', 'Rubiales', 'Coke', 'Aspas', 'liminados', 'jugadores', 'ràcies', 'ussia', 'cabreo', 'cabrea', 'ARGENTINOS', 'BRASILEÑOS', 'GEA', 'caido esto', 'caído esto', 'SANTO', 'Ni OLVIDO', 'Ni olvido', 'NI OLVIDO', 'ni olvido', 'rusi', 'merecido', 'eliminac', 'TRAIDOR', 'cyka', 'Carrer', 'tiki taka', 'tiqui taca', 'tiquitaca', 'GÉNERO', 'CROACIA', 'LOCA', 'ROTONDA', 'ballena', 'Camerún', 'jecucion', 'rotonda', 'Javith', 'javith', 'INFIEL', 'Luis Enrique', 'LUIS ENRIQUE', 'Pêdro Sánchez', 'SUV', 'Willy To', 'willy to', 'primer día de uni', 'primer dia de cla', 'primer día de cla', 'primer dia de uni', 'POCOPHONE', 'pocophone', 'Pocophone', 'iPhone', 'tatuaje', 'Serena', 'thuma', 'Thuma', 'AZIS', 'azis', 'cambio de hora', 'all of', 'SASEL', 'sasel', 'Sasel', 'plagi', 'ourinho', 'tegui', 'GUTI', 'guti', 'Guti', 'novia', 'NOVIA', 'Novia', 'cuernos', 'Cuernos', 'CUERNOS', 'de los Ani', 'de los ani', 'Mi mano', 'mi mano', 'sacandosela', 'sacándosela', 'Vinicius', 'vinicius', 'vtc', 'VTC', 'Vtc', 'Dončić', 'Dončic', 'Doncić', 'Doncik', 'Doncic', 'Luka', 'Luca Don', 'mani ', 'frik', 'Lassa', '-Barca', 'pacma', 'Pacma', 'PACMA', 'deuda', 'Vape', 'vape', 'mpujaca', 'alfa', 'ALFA', 'fach', 'FACH', 'POLIT', 'polit', 'Fach', 'Polit', 'Alfa', 'EBATE', 'ebate', 'Iglesi', 'iglesi', 'moderador', 'CASADO', 'Casado', 'casado', 'elect', 'voto ', 'INMIGR', 'NSFW', 'nsfw', 'Nsfw', '+18', '+17', '+16', '+15', '+14', '+13', '+12', '+11', '+10', '+9', '+8', '+7', '+6', '+5', '+4', '+3', '+2', 'Telafo', 'telafo', 'Tefo', 'tefo', 'osfo', 'Osfo', 'Oslafo', 'oslafo', 'abusa', 'ABUSA', 'Abusa', 'ROSALÍA', 'Rosalía', 'rosalía', 'Rosalia', 'rosalia', 'ROSALIA', 'ODIO', 'andaluces', 'Ortega Smith', 'ortega smith', 'Corona', 'CORONA', 'corona', 'virus', 'Virus', 'VIRUS', 'mascarilla', 'Mascarilla', 'MASCARILLA', 'gente mayor', 'GENTE MAYOR', 'Gente mayor', 'PS5', 'se nos viene', 'SE NOS VIENE', 'impuest', 'IMPUEST', 'Impuest', 'COVID', 'covid' , 'Covid', 'cuarente', 'Cuarente', 'CUARENTE', 'FERNANDO SIMON' , 'FERNANDO SIMÓN', 'Fernando Simon', 'Fernando Simón', 'la curva', 'La curva', 'LA CURVA', 'Amancio', 'AMANCIO', 'INDITEX', 'CONFINA', 'Confina', 'confina', 'de alarma', 'DE ALARMA', 'emoji', 'Ayuso', 'AYUSO', '11 de abril' ,'13 de abril', 'manif', 'Manif', 'MANIF', 'ERTE', 'enfermer', 'Enfermer', 'ENFERMER', 'OMS', 'RELIGIÓN', 'religión', 'Religión', 'religion', 'RELIGION', 'Religion', 'Batasuna', 'BATASUNA', 'batasuna', 'Ofend', 'Ofénd', 'ofend', 'ofénd', 'Alvise', 'ALVISE', 'alvise', 'MENAS', 'menas', 'Mena', 'MENA', 'mena', 'OFENSIV', 'ofensiv', 'Ofensiv', 'prohib', 'ROJOS', 'rojos', 'MARIC', 'maric', 'Maric', 'trading', 'macbook', 'Macbook', "FUSIL", "fusil", "Fusil", "Bomb", "bomb", "alqui", 'vacuna', 'Vacuna', 'VACUNA', 'inclusivo', 'Inclusivo', 'INCLUSIVO', 'monolito', 'MONOLITO', 'Monolito', 'malos tratos', 'MALOS TRATOS', 'cyberpunk', 'Cyberpunk', 'CYBERPUNK', '2077', 'Stadia', 'stadia', 'onlyfans', 'Onlyfans', 'OnlyFans', 'ONLYFANS', 'Koeman', 'Riqui', 'Puig', 'madrile', 'Madrile', 'MADRILE', 'MADRIZ', 'madriz', 'Madriz', 'madriZ', 'MadriZ', 'nive', 'censura', 'nieve', 'temporal', 'MÉDICO', 'Médico', 'médico', 'medico', 'MEDICO', 'Medico', 'SANITARIO', 'Sanitari', 'sanitari', 'conejo', 'ELXOKAS', 'Elxokas', 'elxokas', 'Biden', 'biden', 'BIDEN', 'Transgenero', 'TRANSGENERO', 'transgenero', 'Transgénero', 'TRANSGÉNERO', 'transgénero', 'Auronplay', 'AURONPLAY', 'auronplay', 'tiktok', 'tik tok', 'Tik Tok', 'TikTok', 'Tiktok', 'TIKTOK', 'TIK TOK', 'prostit', 'Prostit', 'a 120', 'A 120', 'taliban', 'talibán', 'Taliban', 'Talibán', 'TALIBAN', 'TALIBÁN', 'txebarr', 'TXEBARR', 'Pfizer', 'PFIZER', 'pfizer', 'ischief', 'fgan', 'FGAN'];



// Usuarios a filtrar:
var usuarios = ['ejemplo', 'usuarios', 'neymarc', 'Yatusae', 'heroinfather', 'Mega_Man', 'Curry Pixoliña', 'sr_loboo', 'Sir.Arthur', 'Perseus24', 'rudo', 'Paul_Atreides', 'lala maestro', 'Samus', 'Fracasado Sano', 'Patata Senpai', 'Rihanno', 'Ibuprofético', 'D.Olowakandi', 'Zhery', 'Gabikun', 'sick my duck', 'javirnof', 'Patas De Peces', 'Garlinga', 'kakumen', 'Pallaringa', 'Hierraco', 'Raiden-M3', 'k1ll1n6', 'Zorbasll', 'Behappy', 'UnGilipollas', 'Flux Capacitor', 'ZorbasII', 'Pacifista', 'Kalin_White', 'LordFucker', 'hp_auto', 'Kawajbr', 'nudosdj', 'HappyPil', 'Paperplane', 'Kundero Sano', 'MORENO2680', 'The Posse', 'Mrdave', 'danirg92', 'CLICK', 'Aitorr', 'amgcoco', 'Guindillo99', 'FXOUSA', 'Medio', 'Chinegua', 'Cuartos Viejos', 'Microkorg', 'joseag', 'tobalion', '016', 'Bounty Hunter', 'The Dude_', 'Mira_Macho', 'Príncipe Azor', 'ZID', 'JLAd', 'g_g', 'MalKarma', 'alkadesign', 'Harry.Stamper', 'Zharrat', 'PaxEsxCa', 'Esp 2008', 'rotceh', 'EDantes', 'bugatti1001', 'lackman87', 'Fenix_ardiente', 'omzaar', 'L-ibra', 'ManuGD', 'El Reverendo', 'Linkle', 'WSullivan', 'Lacietobs', 'VirtuaNEStor', 'jsseaess', 'Henry14.', 'Neoi', 'SPQR!', 'djrelu', 'Arraki', 'J306.', 'Michael Witman', 'Marcelobielsa', 'Seth Gold', 'profesor-qw', 'Electrik', 'FiveOrder', 'might69', 'HeadSh0t', '(Jack Dawson)', 'Ibuki', 'moha26', 'Husbando', 'Tak!', 'SOLOBIS', 'Anakin.', 'Inodoro', 'Bismarck', 'lala glorioso', 'Blademasterz', 'peugpams', 'Salomondrin', 'puppy10', 'Rude Kid', 'Wayni35', 'Johnny Dep', 'Comandante Gin', 'yoqse tio xdxd', 'Fondos', 'MalakrestaCo', 'Bane', 'nibiru25', 'JineteNoctuno', 'trasgok', 'Exitido2', 'NINTENDER0', 'Vartak', 'piezecitas', 'MR. FOREX', 'Ratatat', 'Picachux', 'Rayo_Lase', 'Carlos_Gardel', 'Red_Barclay', 'pepemore', 'PseudoMistico', 'Señor Tomate', 'Mallorn', 'Unow19', 'Miawth', 'Kerensky', 'TuLotero', 'Yamada Kun', 'EL LISTO DE FC', 'Juan25', 'Akenator', 'calabacinloco', 'Abituayamiento', 'MattD.', 'Colebrook', 'Tabaire', 'Gadirita22', 'Henry Heck', 'Karken', 'Desgraciaten', 'Batman Retard', 'DientesDMadera', 'Sr Puigdemont', 'Hayux', 'Locon', 'JMpower85', 'Bersuit', 'Prudensio', 'Fulbe', 'Maxde80', 'Chulapo', 'ErwinRommel', 'Rodrigox', 'Escrotinn', 'zombicat 5.0', 'Haller', 'sugus93', 'EsperanzaHimler', 'Rachel Blue', 'ElnairvanaYT', 'Exo92', 'Freskitolp', '@252', 'MEGAZORD', 'kawaii desu ne', 'Adicta', 'Iker Casillas †', 'Dxxt', 'chirlaque', 'Daseinz', 'dave666', 'Ranchero', 'Klo', 'AST', 'Bnext', 'Penguin', 'Pergamino Po', 'LaWapixima', 'D.Olowakandi.', 'El rayquaza', 'Foroperros', 'Mainteacher', 'Röbin Sherbasky', 'elcrack_81', 'Oasis-', 'MindySimmons', 'zombicat 7.0', 'NosoyHomo', 'El_educador', 'theSpoilerFF', 'Kimey', 'Thnks', 'MaGiVer 2.0', 'Llonguetina', 'mazingertetas', 'Dani Cebollas', 'Tabuu', 'MisCojones33', 'V. Jones', 'CiudadanoChe', 'saturno 5', 'Top_Spin', 'ZinedinZidan', 'Tupolev Tu-160', 'zlatann', 'Jotacee', 'Apinchu', 'CalcioMan', 'MasterOfTuppers', 'Danny_Williams', 'franetti', 'PENDEJO', '2-D', 'Shaggy_F1', 'rcg6666', 'Señor Serio', 'kefe', 'rafichuli', 'manu_riu', 'GDlike', 'Machirulo', 'Trozo de queso', 'Mr.Rager', 'Hyugaa', 'Ave fenix.', 'El Palancas', 'jotapiquer', 'Niño de la bici', 'Zeks', 'localbuses', 'Tetosky', 'OhDaeSu', 'McLovin93', 'Smugg', 'neoxido20', 'Zoisela', 'Valentina86', 'Mave Irving', 'tx1419', 'Flók¡', 'Misfit', 'txetxi92', 'Di3GO95', 'Shuro', 'Jenn Lawrence', 'qosmio', 'Never Reformed', 'Invert', 'fmg16', 'gurdjieff', 'inuyasa', 'Payo', 'Slask', 'ruedex8', 'Rude Gambler', 'kafre', 'Sutree', 'Fenix106', 'Levrom Yeims', 'byRubik', 'play by play', 'TheRorista', 'Elchachebolu', 'carlongas', 'Magedio', 'Mala vida 13', '§in_ConeXion', 'Kukigol', 'Pole man', 'Ensaladilla', 'pensiero', 'Coleccionador', 'mashurdonte', 'meliendres', 'VFoxtTroT', 'Shurnanito', 'Mc Carnigan', 'Paradox_Rey', 'Saturos', 'QueNoMeAchanto', 'drakonian', 'buencash', 'uoc84', 'Yayi1992', 'Laser', 'chuchifranco', 'reizelkrad', 'Selective', 'TypeX', 'bartun', 'Hank.Scorpio', 'Guindillo', 'Portuano', 'Tsubasa94', 'Janter', 'asqueos', 'MELISH', 'Gato Blanco', 'Mabel', 'cuchaaa', 'Monigote', 'Scray', 'kkopito', 'Elder Limitao', 'risotto', 'Gazpachito', 'RLyGuy', 'Ikki_Fenix', 'Pistonpower', 'Melonsio', 'Pepinohispano', 'Sucoffee'];






// Menu ocultos (crear)
var visible = false;
$("body").before("<div id='scr-ocultos'><div id='panelOcultos'><div id='contFiltrado'></div></div></div>");



// Script para filtrar
var filtroPalabras = document.querySelectorAll('a[href*="showthread.php"]');
var filtroUsuarios = document.querySelectorAll('span[onclick*="member.php?u="], a[href*="/foro/member.php?u="]');
for (var i = 0; i < filtroPalabras.length; i++) {
	comprobarPalabras(filtroPalabras[i], 'textContent');
}
for (var i = 0; i < filtroUsuarios.length; i++) {
	comprobarUsuarios(filtroUsuarios[i], "textContent");
}
function comprobarPalabras(obj, elemento) {
	var text = obj[elemento];
	for (var i = 0; i < palabras.length; i++) {
		if (text.toLowerCase().indexOf(palabras[i].toLowerCase()) !== -1) {
   // No resalta coincidencia si hay palabras clave antes de caracter especial (ej.: no resalta "el +1 de las", pero si resalta "+1 de las")
			var palabrasEscape = palabras[i].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); 
			obj.innerHTML = obj.innerHTML.replace(new RegExp('(' + palabrasEscape + ')', 'gi'), "<span class='p-filtrada'>$1</span>");
   // No resalta coincidencias no exactas, diferencia mayusculas y minusculas (ej.: si la palabra clave es "futbol" no resalta "Futbol", "FUTBOL")
   // obj.innerHTML = obj.innerHTML.replace(palabras[i], "<span class='p-filtrada'>" + palabras[i] + "</span>");
   // Alternativa 100% funcional seria pasar este toLowerCase, pero seria visual
			obj.closest('tr').style.display = "none";
			$("#contFiltrado").append("<div class='filtradoAll filtrado-p'>" + obj.closest("tr").innerHTML + "</div>");
		}
	}
}
function comprobarUsuarios(obj, elemento) {
	var text = obj[elemento];
	for (var i = 0; i < usuarios.length; i++) {
		if ((text.toLowerCase() === usuarios[i].toLowerCase()) || (text.toLowerCase() === usuarios[i].slice(0, 8).toLowerCase() + "..")) {
   // No es necesario preocuparse por las coincidencias al ser una sola palabra exacta
			obj.innerHTML = obj.innerHTML.replace(usuarios[i], "<span class='u-filtrado'>" + usuarios[i] + "</span>");
			obj.innerHTML = obj.innerHTML.replace(usuarios[i].slice(0, 8) + "..", "<span class='u-filtrado'>" + usuarios[i].slice(0, 8) + ".." + "</span>");
			obj.closest("tr").style.display = "none";
			$("#contFiltrado").append("<div class='filtradoAll filtrado-u'>" + obj.closest("tr").innerHTML + "</div>");
		}
	}
}



// Menu ocultos (base)
$("#scr-ocultos").prepend("<div id='abrirOcultos'></div>");
$("#abrirOcultos").click(function() {
	if (!visible) {
		$("#scr-ocultos").children("#panelOcultos").css({
			"display": "block",
			"position": "fixed",
			"z-index": "100",
			"width": "100%",
			"height": "100%"
		});
		visible = true;
		$("#abrirOcultos").css({
			"display": "none"
		});
	}
});
$("#panelOcultos").prepend("<div id='cerrarOcultos'></div>");
$("#cerrarOcultos").click(function() {
	if (visible) {
		$("#scr-ocultos").children("#panelOcultos").css({
			"display": "none"
		});
		visible = false;
		$("#abrirOcultos").css({
			"display": "block",
		});
	}
});
$("#scr-ocultos").children("#panelOcultos").css({
	"display": "none"
});


// Menu ocultos (panel)
$("#abrirOcultos").css({
	"cursor": "pointer",
	"position": "absolute",
	"z-index": "101",
	"display": "block",
	"width": "24px",
	"height": "24px",
	"background": "url(https://i.imgur.com/k5l5pdD.png) no-repeat center",
	"background-size": "24px",
	"right": "12px",
	"top": "19px",
	"opacity": ".2",
	"transition": ".2s"
});
$("#abrirOcultos").mouseover(function() {
	$("#abrirOcultos").css("opacity", ".87");
});
$("#abrirOcultos").mouseout(function() {
	$("#abrirOcultos").css("opacity", ".2");
});
$("#cerrarOcultos").css({
	"cursor": "pointer",
	"position": "fixed",
	"z-index": "100",
	"width": "100%",
	"height": "100%",
	"background": "rgba(128,128,128,.4)"
});
$("#contFiltrado").css({
	"padding": "24px",
	"background": "#fff",
	"overflow": "auto",
	"z-index": "101",
	"width": "calc(75% - 48px)",
	"max-height": "calc(90% - 48px)",
	"left": "50%",
	"top": "50%",
	"transform": "translate(-50%,-50%)",
	"position": "fixed",
	"box-shadow": "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
	"border-radius": "2px"
});


// Menu ocultos (contenido)
$(".filtradoAll").css({
	"font-size": "0",
	"font-family": "Roboto, Arial",
	"padding": "16px",
	"border-bottom": "1px solid rgba(0,0,0,.1)",
	"width": "calc(100% - 32px)"
});
$(".filtradoAll").children("div").children("span").css({
	"font-family": "Roboto, Arial"
});
$(".filtradoAll").children(".texto, strike, a, div").css({
	"font-size": "14px",
	"display": "table"
});
$(".filtradoAll").children("a:not(:nth-of-type(2)):not([href^='/foro/member.php?u=']), img, div:not(:nth-of-type(1)):not(:nth-of-type(2))").css({
	"display": "none"
});
$(".filtradoAll").children("div").children(".smallfont, span[style='float:right']").css({
	"display": "none"
});
$(".filtradoAll").children("div").children("a, span").children("img").css({
	"display": "none"
});
$(".filtradoAll").children("div").children("span").children("a").children("img").css({
	"display": "none"
});

$(".p-filtrada").css({
	"background": "rgba(244,67,54,.7)",
	"color": "#fff",
	"padding": "2px 0",
	"border-radius": "2px",
	"text-decoration": "line-through"
});
$(".u-filtrado").css({
	"background": "rgba(255,235,59,.7)",
		"padding": "2px 0",
	"border-radius": "2px",
	"text-decoration": "line-through"
});