// ==UserScript==
// @name        Chimera Jira
// @author      John Colosi
// @namespace   http://johncolosi.com
// @include     https://jira.vrsn.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.13/clipboard.min.js
// @version     2023.2.6
// @description Add features to Jira pages
// @change      Adding a feature to replace long numeric Jira IDs with common first names
// @downloadURL https://update.greasyfork.org/scripts/35773/Chimera%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/35773/Chimera%20Jira.meta.js
// ==/UserScript==


// Constants
var MillisPerSecond = 1000;
var MillisPerMinute = 60 * MillisPerSecond;
var MillisPerHour = 60 * MillisPerMinute;
var MillisPerHalfHour = 30 * MillisPerMinute;
var Clocks = ["=----", "-=---", "--=--", "---=-", "----=","---=-", "--=--", "-=---"];


// Variables
var jxInterval;
var jxRunning = false;
var jxLastClickTime = null;
var jxThisClickTime = null;
var jxBankedTime = null;
var jxTargetTime = null;
var clipboard = new Clipboard('.jxBtnCopy');
var isKanban = false;


// Replace long numeric Jira IDs
var jiraNames = [ "Kayson", "Nicholas", "Jonah", "Aranza", "Mikaela", "Armani", "Averie", "Luciana", "Kaleb", "Jayson", "Baylor", "Cayden", "Anahi", "Myla", "Louise", "Casen", "Yareli", "Athena", "Celeste", "Giselle", "Rhett", "Carolyn", "Austyn", "Angel", "Kyleigh", "Coleman", "Quinn", "Valentino", "Alan", "Ophelia", "Ainsley", "Selah", "Abdullah", "Maximilian", "Titus", "Amaris", "Arjun", "Wesley", "Cheyenne", "Skye", "Xavier", "Evelyn", "Gabrielle", "Anson", "Anthony", "Briana", "Bridget", "Juliette", "Remington", "Clyde", "Patricia", "Peyton", "Briley", "Jaelynn", "Victoria", "Emiliano", "Aminah", "Emmy", "Jorge", "Alyson", "Janessa", "Summer", "Kyler", "Cedric", "Ashlynn", "Nyla", "Dexter", "Kobe", "Sasha", "Paisley", "Everlee", "Vicente", "Axl", "Colin", "Evelynn", "Patience", "Jayceon", "Elizabeth", "Frank", "Rory", "Lena", "Kaison", "Ashton", "Simone", "Azaria", "Thatcher", "Scarlett", "Marjorie", "Amia", "Gloria", "Nadia", "Hunter", "Camila", "Annalee", "Will", "Azariah", "Kyrie", "Antonia", "Kannon", "Ashley", "Kaya", "Mayson", "Dahlia", "Clay", "Miley", "Harper", "Aliza", "Ariella", "Renee", "Kathleen", "Devon", "Brentley", "Emilio", "Derrick", "Chance", "Jade", "Kaylynn", "Lilian", "Madilyn", "Aislinn", "Berkley", "Joaquin", "Ryker", "Alaia", "Maisie", "Carla", "Kylan", "Ciara", "Amelia", "Princeton", "Manuel", "Robin", "Moises", "Lilianna", "Rodrigo", "Madilynn", "Angelina", "Khalil", "Oscar", "Aubree", "Emerie", "Malaysia", "Kayleigh", "Tiana", "Anika", "Felix", "Parker", "Julio", "Sky", "Lexi", "Sharon", "Curtis", "Hana", "Kolten", "King", "Dorothy", "Brinley", "Felicity", "Aileen", "Joe", "Harleigh", "Braelyn", "Madisyn", "Adelaide", "Emmalee", "Mckinley", "Marshall", "Aryan", "Westin", "Dani", "Harmony", "Abdiel", "Regan", "Jamie", "Jaxen", "Emery", "Ruby", "Alexis", "Perla", "Fletcher", "Blaine", "Emmitt", "Kaliyah", "Alyvia", "Sam", "Karlee", "Wendy", "Charlie", "Jewel", "Ray", "Noah", "Kiara", "Annabelle", "Mckenzie", "Jazlyn", "Janiya", "Edwin", "Sidney", "Bruce", "Kevin", "Naomi", "Dax", "Lea", "Phoenix", "Eden", "Finley", "Aidan", "Virginia", "Dallas", "Heath", "Amaya", "Austin", "Giancarlo", "Kassidy", "Zariyah", "Alexandria", "Noemi", "Tate", "Aldo", "Brayan", "Kailani", "Holland", "Tanner", "Crew", "Wren", "Emilia", "Devin", "Hallie", "Arian", "Terrence", "Immanuel", "Giovanni", "Alisa", "Aiden", "Blaise", "Jacob", "Billy", "Natalie", "Zackary", "Nikolas", "Lucian", "Emmie", "Jenna", "Ezequiel", "Royce", "Penelope", "Emersyn", "Alyssa", "Reyna", "Reese", "Jessie", "Tristen", "Marilyn", "Bryce", "Grace", "Melany", "Blakely", "Daisy", "Scarlette", "Aliah", "Dulce", "Estella", "Nehemiah", "Gracelynn", "Liana", "Lilyana", "Yosef", "Raylan", "Leona", "Noel", "Ronan", "Jerome", "Zion", "Jaylene", "Averi", "Catalina", "Jazmine", "Beckett", "Matilda", "Hadlee", "Emerson", "Ace", "Ingrid", "Piper", "Kristina", "Laura", "Ramon", "Maliyah", "Daniela", "Zoe", "Javion", "Kayden", "Jayde", "Luz", "Zoie", "Mustafa", "Kyle", "Yasmin", "Elisha", "Allie", "Charlee", "Elise", "Zaylee", "Kali", "Anderson", "Kiley", "Kalani", "Cody", "Georgia", "Jakob", "Brian", "Megan", "Bayleigh", "Eli", "Mila", "Arya", "Leland", "Willie", "Adeline", "Archer", "Luke", "America", "Joey", "Brandon", "Jesse", "Erika", "Katelynn", "Paris", "Macey", "Kate", "Corinne", "Irene", "Logan", "Luis", "Gabriella", "Hugh", "Liberty", "Monserrat", "Eve", "Hannah", "Sarai", "Brenna", "Aylin", "Nathanael", "Marley", "Marianna", "Bianca", "Sawyer", "Rebekah", "Corey", "Damari", "Arabella", "August", "Amiya", "Clare", "Micah", "Jayda", "Evan", "Joanna", "Gwen", "Saige", "Titan", "Zion", "Evalynn", "Veda", "Omar", "Julian", "Allen", "Myra", "Kira", "Kara", "Tinsley", "Skylar", "Tommy", "Kaelyn", "Kylee", "Fabian", "Bella", "Carl", "Jamari", "Eddie", "Joel", "Samuel", "Zane", "Grayson", "Alaina", "Zelda", "Roy", "Jonathan", "Natalia", "Angie", "Alissa", "John", "Holly", "Genevieve", "Beckham", "Preston", "Ellis", "Galilea", "Bennett", "Delilah", "Lillianna", "Madeline", "Hattie", "Iris", "Adrienne", "Vihaan", "Albert", "Paityn", "Crystal", "Josephine", "Cory", "Andi", "Rory", "Zoey", "Avianna", "Winston", "Kingston", "Violet", "Kameron", "Emerson", "Dominik", "Amya", "Regina", "Javon", "Angelique", "Grady", "Yamileth", "Hadley", "Alessandra", "Teagan", "Astrid", "Wilson", "Laylah", "Dorian", "Veronica", "Nathaniel", "Briggs", "Sutton", "Karen", "Makenzie", "Lara", "Donald", "Roselyn", "Sloane", "Ulises", "Andrea", "Cade", "Elijah", "Hendrix", "Andy", "Pierce", "Quincy", "Rivka", "Isabella", "Giovanna", "Kole", "Rylan", "Serena", "Danielle", "Mckayla", "Gianna", "Sonia", "Kash", "Gunner", "Rhys", "Jeremy", "Braylen", "Amy", "Collins", "Cora", "Andre", "Peyton", "Jasmine", "Leila", "Jedidiah", "Clark", "Jesus", "Anna", "Emilee", "Xander", "Kalel", "Hassan", "Lochlan", "Harry", "Jude", "Eden", "Nikolai", "Lawrence", "Arden", "Elisabeth", "Zavier", "Thomas", "Milan", "Samir", "Elliott", "Amare", "Amirah", "Lylah", "Giovani", "James", "Vivaan", "Liv", "Declan", "Makayla", "Avery", "Gideon", "Kristen", "Atlas", "Meredith", "Tenley", "Leonardo", "Farrah", "Braeden", "Alvin", "Rodney", "Blair", "Raiden", "Milana", "Nataly", "Rachel", "Brantlee", "Alejandro", "Aubriella", "India", "Dennis", "Braylee", "Kaden", "Landyn", "Kendrick", "Roger", "Zechariah", "Max", "Itzel", "Kristian", "Sergio", "Alayah", "Destiny", "Arielle", "Tony", "Miranda", "Demetrius", "Enoch", "Henrik", "Maleah", "Castiel", "Maddie", "Danny", "Cara", "Eduardo", "Ricardo", "Millie", "Reuben", "Mitchell", "Nayeli", "Amayah", "Jennifer", "Kai", "Alfonso", "Elyse", "Mary", "Emanuel", "Presley", "Misael", "Joy", "Amani", "Jaden", "Iliana", "Jolene", "Mercy", "Whitney", "Trinity", "Ivory", "Ameer", "Knox", "Meilani", "Malaya", "Case", "Paisleigh", "Jocelyn", "Addisyn", "Maxton", "Ronald", "River", "Dominic", "Issac", "Lane", "Joslyn", "Mylah", "Alice", "Deacon", "Brooke", "Bentlee", "Natasha", "Dominick", "Dustin", "Parker", "Cassius", "Axel", "Conner", "Kora", "Blaze", "Katelyn", "Kenya", "Robyn", "Myles", "Orion", "Cristian", "Darian", "Angeline", "Charlize", "Lincoln", "Gavin", "Eloise", "Marissa", "Adalynn", "Raymond", "Luka", "Reid", "Matteo", "Tatiana", "Marina", "Karina", "Terry", "Lydia", "Dean", "Rylie", "Francesca", "Estelle", "Olivia", "Reese", "Harlan", "Kendall", "Bobby", "Siena", "Brooklynn", "Douglas", "Alana", "Cali", "Morgan", "Annabella", "Julie", "Addyson", "Linda", "Fernanda", "Anabella", "Sydney", "Adelyn", "Kaylie", "Ayla", "Easton", "Lennon", "Gerardo", "Ariadne", "Aviana", "Mohammad", "Angela", "Mario", "Amalia", "Alexis", "Larry", "Christine", "Jayden", "Brett", "Christina", "Jaylynn", "Lorelai", "Layla", "Bryleigh", "Gauge", "Hope", "Jack", "Sophia", "Lyric", "Adriel", "Kaiden", "Remi", "Adilynn", "Zaiden", "Enrique", "Milo", "Kamden", "Kelly", "Kamdyn", "Ivan", "Noelle", "Fatima", "Nico", "Abril", "Jose", "Reina", "Brody", "Noe", "Elliott", "Mattie", "Daxton", "Graysen", "Alisha", "Leah", "Rowan", "Cooper", "Lance", "Willow", "Cataleya", "Isabela", "August", "Kadence", "Aiyana", "Mohamed", "Zachariah", "Nova", "Jaylah", "Madeleine", "Harley", "Rylee", "Hunter", "Joseph", "Harrison", "Marie", "Alianna", "Alonso", "Kolby", "Aurelia", "Aarav", "Braxton", "Lennox", "Channing", "Payton", "Boston", "Paige", "Nelson", "Rosemary", "Kellen", "Alexzander", "Miles", "Jaxson", "Michelle", "Cole", "Lauryn", "Adelina", "Kaydence", "Finnley", "Giuliana", "Harlow", "Maximiliano", "Warren", "Augustus", "Louisa", "Owen", "Adrien", "Cameron", "Evangeline", "Darren", "Kody", "Moshe", "Julieta", "Kaia", "Ismael", "Peter", "Chloe", "Audrina", "Tegan", "Eileen", "Alberto", "Rebecca", "Livia", "Tristan", "Maximus", "Ryan", "Kailey", "Kenna", "Mae", "Zuri", "Charlotte", "Lailah", "Annabel", "Alina", "Emmet", "Gregory", "Eliza", "Colton", "Ann", "Bonnie", "Olive", "Mariana", "Benjamin", "Sarah", "Ezra", "Trent", "Monroe", "Giana", "Jon", "Alaysia", "Esther", "Riley", "Sonny", "Prince", "Nathalia", "Braiden", "Giavanna", "Layton", "Camilla", "Jonathon", "Chana", "Elsie", "Kassandra", "Jenny", "Elliot", "Danica", "Leonidas", "Juliet", "Casey", "Jace", "Araceli", "Elina", "Markus", "Nylah", "Bode", "Armani", "Kelvin", "Kyla", "Nathaly", "Nixon", "Conor", "Maya", "Mekhi", "Montserrat", "Ryder", "Mira", "Amber", "Madelyn", "Sara", "Briar", "Logan", "Jamal", "Kasey", "Vivienne", "Libby", "Otto", "Leo", "Baylee", "Ella", "Alayna", "Saul", "Rowan", "Jaycee", "Hadassah", "Kason", "Samson", "Scarlet", "Raphael", "Brynn", "Courtney", "Jessica", "Jasmin", "Shiloh", "Izaiah", "Alec", "Lyric", "Ariah", "Bowen", "Quinton", "Kayla", "Paulina", "Kayden", "Fisher", "Autumn", "Jazmin", "Walter", "Jayden", "Stefan", "Rhea", "Lilly", "Anais", "Ayleen", "Elaina", "Elliana", "Raul", "Mina", "Dillon", "Mavis", "Alicia", "Jocelynn", "Cash", "Ellis", "Lexie", "Pedro", "Liliana", "Otis", "Allison", "Aliyah", "Bailee", "Jacoby", "Jaida", "Kade", "Troy", "Lindsey", "Aisha", "Terrance", "Lizbeth", "Keegan", "Ariyah", "Halle", "Cristiano", "Danna", "Gemma", "Greyson", "Dalia", "Alonzo", "Zaria", "Avalyn", "Gianni", "Roland", "Karson", "Beatrice", "Uriah", "Juliana", "Kieran", "Forrest", "Jordyn", "Jett", "Mariam", "Tucker", "Kathryn", "Ramona", "Natalee", "Seth", "Braden", "Armando", "Jordan", "April", "Royal", "Stephen", "Erica", "Camron", "Santiago", "Heidi", "Cason", "Jordy", "Eric", "Brock", "Kensington", "Caroline", "Ariya", "Waylon", "Lee", "Byron", "Dallas", "Jaelyn", "Hailee", "Nevaeh", "Carson", "Zahra", "Ronin", "Rayna", "Gia", "Raelynn", "Kaelynn", "Michael", "Milena", "Henley", "Landon", "Bryan", "Franco", "Jonas", "Sloan", "Kasen", "Maggie", "Tiffany", "Mauricio", "Abby", "Zendaya", "Ava", "Kaylin", "Crosby", "Vance", "Gustavo", "Robert", "Stetson", "Kolton", "Hayley", "Spencer", "Cannon", "Aaliyah", "Haylee", "Anaya", "Axton", "Salvador", "Aydin", "David", "Emmalyn", "George", "Raven", "Ty", "Gwendolyn", "Emelia", "Marlee", "Skyla", "Romina", "Rosa", "Adrian", "Journey", "Avery", "Houston", "Emmaline", "Rose", "Moses", "Julissa", "Odin", "Jax", "Aryana", "Eleanor", "Enzo", "Khloe", "Hudson", "Carlee", "Juniper", "Urijah", "Tinley", "Tripp", "Jagger", "Aimee", "Frankie", "Elias", "Taylor", "Callan", "Renata", "Breanna", "Evie", "Amari", "Camden", "Edith", "Maxwell", "Charlie", "Jillian", "Sebastian", "Nathan", "Dakota", "Aden", "Corbin", "Kareem", "Ayden", "Kamryn", "Johanna", "Ember", "Alani", "Noa", "Brooks", "Judith", "Maia", "Priscilla", "Gracelyn", "Temperance", "Cynthia", "Amara", "Melvin", "Jemma", "Brittany", "Emery", "Brennan", "Harley", "Graham", "Nina", "Fernando", "Leslie", "Rex", "Melina", "Mark", "Vincent", "Kailee", "Apollo", "Freya", "Yaritza", "Dane", "Paula", "Gabriel", "Azalea", "Madalyn", "Johnathan", "Arlo", "Dwayne", "Aniya", "Aubrey", "Roman", "Ethan", "Abigail", "Ayva", "Kendall", "Carlos", "Aadhya", "Vaughn", "Ari", "Brooklyn", "Joziah", "Kallie", "Aaden", "Kase", "Maison", "Ryann", "Maverick", "Carmelo", "Jordan", "Josue", "Clarissa", "Faye", "Damien", "Sean", "Sage", "Brianna", "Estrella", "Kynlee", "Chaya", "Raylee", "Trace", "Anabelle", "Nora", "Mathias", "Frances", "Micheal", "Tatum", "Zachary", "Katherine", "Tamia", "Aspen", "Chris", "Marc", "Brenda", "Dante", "Duke", "Randy", "Simon", "Denise", "Moriah", "Kimber", "Julianne", "Benson", "Princess", "Daniella", "Salma", "Hezekiah", "Felipe", "Gerald", "Isaias", "Sabrina", "Jayleen", "Julia", "Amiyah", "Kailyn", "Hector", "Aleena", "Stevie", "Alannah", "Shayla", "Jimmy", "Bryson", "Skylar", "Ford", "Arturo", "Muhammad", "Lewis", "Hadleigh", "Clayton", "Alanna", "Akira", "Rosie", "Lacey", "Davis", "Coen", "Claire", "Carly", "Remy", "Matias", "Leyla", "Shannon", "Legend", "Kiana", "Terrell", "Kaleigh", "Cecilia", "Emmanuel", "Christopher", "Joyce", "Allyson", "Marley", "Cayson", "Amos", "Thea", "Jimena", "Elena", "Sofia", "Ellie", "Orlando", "Zaire", "Martin", "Aubrie", "Yaretzi", "Lucas", "Caitlyn", "Maximo", "Memphis", "Ernesto", "Frida", "Saylor", "Dylan", "Carter", "Lily", "Jared", "Nash", "Draven", "Esme", "Adan", "Adley", "Wyatt", "Sincere", "Lillie", "Nia", "Harold", "Ibrahim", "Isaiah", "Sylas", "Izabella", "Franklin", "Rowen", "Azariah", "Raquel", "Isabelle", "Dariel", "Cameron", "Kellan", "Zander", "Helen", "Raegan", "Tatum", "Melissa", "Tyler", "Ian", "Imani", "Caiden", "Tori", "London", "Alondra", "Colette", "Antonella", "Keith", "Payton", "Frederick", "Darwin", "Caden", "Reece", "Ali", "Junior", "Lucille", "Poppy", "Belen", "Kaylee", "Mathew", "Levi", "Lauren", "Barrett", "Lila", "Ellen", "Zaniyah", "Holden", "Kori", "Maryam", "Norah", "Finley", "Phoebe", "Esmeralda", "Marcel", "Bria", "Yousef", "Milania", "Cruz", "Elisa", "William", "Harlee", "Kenny", "Garrett", "Maxim", "Patrick", "Cambria", "Arianna", "Elianna", "Alison", "Maria", "Braydon", "Roberto", "Killian", "Caitlin", "Vada", "Kinslee", "Jacqueline", "Kaitlynn", "Gwyneth", "Abraham", "Camryn", "Omari", "Charleston", "Brayden", "Ahmed", "Kennedy", "Raina", "Taya", "Donovan", "Marcus", "Audrey", "Lamar", "Leia", "Sawyer", "Rayan", "Brady", "Spencer", "Cyrus", "Elsa", "Derek", "Viviana", "Annie", "Ariel", "Johan", "Alivia", "Kamari", "Mallory", "Collin", "Briella", "Promise", "Lorenzo", "Analia", "Isabel", "Avalynn", "Darius", "Royal", "Aliya", "Conrad", "Myah", "Alisson", "Ayana", "Aitana", "June", "Evalyn", "Kinsley", "Luna", "Rafael", "Chanel", "Antonio", "Lilith", "Jake", "Ben", "Korbin", "Aurora", "Aubrianna", "Aya", "Shiloh", "Willa", "Cohen", "Amanda", "Margot", "Bo", "Katie", "Blake", "Charles", "Paloma", "Eugene", "Nickolas", "Julien", "Neymar", "Emily", "Braelynn", "Helena", "Ivanna", "Hailey", "Langston", "Kyndall", "Jaime", "Hayden", "Ellison", "Diana", "Rey", "Jasiah", "Amina", "Victor", "Jermaine", "Reed", "Eliana", "Ahmad", "Kinley", "Davian", "Rene", "Adele", "Colt", "Carlie", "Kingsley", "Dana", "Maeve", "Michaela", "Sierra", "Addalyn", "Jefferson", "Rayne", "Cecelia", "Sariah", "Bronson", "Pearl", "Ariana", "Colby", "Paul", "Adaline", "Ezekiel", "Lilia", "Brylee", "Fiona", "Yusuf", "Lilyanna", "Toby", "Karter", "Kaysen", "Landry", "Ares", "Iker", "Journee", "Meghan", "Carolina", "Mya", "Nancy", "Maci", "Mara", "Janiyah", "Jamie", "Heavenly", "Josiah", "Kyra", "Canaan", "Jameson", "Chad", "Camille", "Zara", "Savanna", "Keaton", "Magnus", "Gannon", "Aniyah", "Adelynn", "Coraline", "Kennedi", "Everleigh", "Blake", "Henry", "Nola", "Quinn", "Molly", "Brynlee", "Ashlyn", "Uriel", "Malachi", "Ally", "Daniel", "Desiree", "Keagan", "Nicole", "Emory", "Gage", "Daphne", "Abram", "Brielle", "Damon", "Kenzie", "Mabel", "Thalia", "Gordon", "Brecken", "Aleah", "Jase", "Nolan", "Asia", "Londyn", "Marisol", "Clementine", "Neriah", "Joshua", "Ryleigh", "Melody", "Soren", "Ivy", "Luciano", "Shane", "Amelie", "Morgan", "Chelsea", "Cherish", "Steven", "Tyson", "Alden", "London", "Emmett", "Marcos", "Paxton", "Brantley", "Richard", "Abel", "Harper", "Mason", "Lucia", "Kensley", "Pyper", "Diamond", "Julius", "Charleigh", "Chase", "Cullen", "Drake", "Dalary", "Hayes", "Ireland", "Samiyah", "Joelle", "Penny", "Kaitlyn", "Andrew", "Angelo", "Melanie", "Sarahi", "Cassandra", "Raelyn", "Everett", "Devyn", "Anastasia", "Lawson", "Abbigail", "Kai", "Marleigh", "Francis", "Dalton", "Amira", "Callie", "Dixie", "Elaine", "Judson", "Macy", "Josie", "Aubri", "Rosalie", "Scott", "Wayne", "Adonis", "Daleyza", "Anya", "Kaiya", "Aubrielle", "Bodhi", "Remington", "Rayden", "Casey", "Taliyah", "Isaac", "Dash", "Chaim", "Neil", "Duncan", "Laney", "Thiago", "Major", "Louis", "Kaidence", "Rylan", "Haven", "Caleb", "Oliver", "Lola", "Grant", "Taryn", "Maurice", "Alexander", "Jaxon", "Tabitha", "Genesis", "Philip", "Kane", "Skyler", "Tessa", "Keyla", "Maddox", "Sage", "Saniyah", "Elian", "Karlie", "Theodore", "Alexia", "Addilynn", "Colten", "Laila", "Kylie", "Xzavier", "Maliah", "Alena", "Mackenzie", "Zayden", "Flynn", "Theo", "Romeo", "Branson", "Catherine", "Cain", "Kimberly", "Ana", "Trenton", "Angel", "Adalyn", "Elora", "Wade", "Alijah", "Noor", "Danika", "Selena", "Ximena", "Anne", "Lachlan", "Jaiden", "Esperanza", "Zariah", "Kamila", "Jamir", "Sullivan", "Nathalie", "Keira", "Carmen", "Beau", "Miah", "Valeria", "Lukas", "Delaney", "Phoenix", "Finnegan", "Reagan", "Amari", "Janelle", "Alexandra", "Jolie", "Timothy", "Magnolia", "Sophie", "Porter", "Ellery", "Talon", "Hugo", "Jadiel", "Mateo", "Alfredo", "Celine", "Aaron", "Jairo", "Brycen", "Diego", "Luca", "Malik", "Taylor", "Jerry", "Mollie", "Landen", "Lilah", "Gael", "Wynter", "Emmeline", "Phillip", "Bentley", "Zayn", "Kyree", "Treasure", "Stephanie", "Lennon", "Adam", "Ryland", "Ryan", "Riley", "Van", "Kendra", "Brendan", "Hamza", "Callum", "Cesar", "Jaliyah", "Asher", "Mack", "Skyler", "Zeke", "Talia", "Landry", "Zainab", "Tobias", "Shaun", "Lainey", "Hank", "Gary", "Etta", "Kohen", "Jaylee", "Alejandra", "Carina", "Ayaan", "Allan", "Marlon", "Madyson", "Celia", "Susan", "Matthias", "Madison", "Kenia", "Amora", "Johnny", "Connor", "Reginald", "Malcolm", "Deandre", "Ronnie", "Joselyn", "Jackson", "Emely", "Bailey", "Marco", "Sienna", "Milan", "Kamryn", "Aron", "Jayce", "Micah", "Jaylen", "Lisa", "Diya", "Faith", "Janae", "Isla", "Paislee", "Ricky", "Bristol", "Serenity", "Miya", "Calvin", "Erik", "Karter", "Dimitri", "Dayton", "Kaylani", "Thaddeus", "Travis", "Greta", "Edison", "Juan", "Alex", "Edward", "Chandler", "Belle", "Cadence", "Sylvia", "Reyansh", "Ayanna", "Lucca", "Atticus", "Jeffrey", "Meadow", "Kian", "Bruno", "Martha", "Vienna", "Vincenzo", "Santino", "Messiah", "Caylee", "Bradley", "Weston", "Leighton", "Zain", "Jason", "Avah", "Walker", "Jalen", "Laurel", "Mia", "Marcelo", "Jordynn", "Shelby", "Dakota", "Jessa", "Rudy", "Emmalynn", "Jane", "Cassidy", "Drew", "Augustine", "Santana", "Erin", "Jamison", "Jensen", "Elle", "Leilani", "Aria", "Cordelia", "Cindy", "Khaleesi", "Aliana", "Heather", "Abrielle", "Arthur", "Matthew", "Chandler", "Justin", "Adriana", "Sterling", "Katalina", "Shawn", "Addison", "Tomas", "Lyla", "Sariyah", "Damian", "Callen", "Kimora", "Kenley", "Adrianna", "Tara", "Russell", "Annalise", "Teresa", "Barbara", "Dilan", "Brice", "Demi", "Samara", "Vivian", "Charley", "Zayne", "Anniston", "Jaylin", "Oakley", "Bryant", "Lorelei", "Amir", "Layne", "Konnor", "Arely", "Ada", "Kyson", "Heaven", "Elliot", "Judah", "Finn", "Leanna", "Deborah", "Andres", "Kenneth", "Bethany", "Braylon", "Dayana", "Alaya", "Carter", "Everly", "Claudia", "Samantha", "Trevor", "Lilliana", "Mariyah", "Macie", "Miriam", "Ruben", "Griffin", "Malakai", "Niko", "Justus", "Jayla", "Naya", "Leonel", "Jazlynn", "Javier", "Yahir", "Justice", "Jasper", "Erick", "Savannah", "Haley", "River", "Harvey", "Quentin", "Sadie", "Lana", "Hanna", "Ruth", "Lucy", "Silas", "Lindsay", "Audriana", "Malia", "Benton", "Justice", "Trey", "Mikayla", "Kelsey", "Milani", "Liam", "Ellianna", "Bryanna", "Karsyn", "Jaxton", "Madalynn", "Nala", "Aryanna", "Brent", "Aanya", "Hayden", "Vivien", "Lionel", "Stella", "Nicolas", "Lia", "Valerie", "Dawson", "Madelynn", "Guillermo", "Israel", "Denver", "Madden", "Kristopher", "Jeffery", "Gabriela", "Eva", "Jana", "Mariah", "Francisco", "Kairi", "Leonard", "Christian", "Lina", "Jeremiah", "Gracie", "Vera", "Miller", "Emma", "Jay", "Vanessa", "Solomon", "Mohammed", "Hazel", "Julianna", "Addilyn", "Asa", "Edgar", "Miguel", "Rohan", "Sandra", "Emory", "Maddison", "Camdyn", "Karla", "Paola", "Desmond", "Ariel", "Makai", "Ari", "Brodie", "Alma", "Davion", "Winter", "Dylan", "Lillian", "Brenden", "Annika", "Alia", "Alessandro", "Elin", "Rocco", "Miracle", "Kiera", "Charli", "Guadalupe", "Oakley", "Leon", "Valentina", "Lennox", "Leighton", "Lyra", "Esteban", "Clara", "Pablo", "Alexa", "Leandro", "Zaid", "Rogelio", "Ansley", "Remy", "Angelica", "Marvin", "Mckenna", "Margaret", "Makenna", "Anders", "Emilie", "Monica", "Jada", "Londynn", "Gunnar", "Harmoni", "Nasir", "Stanley" ];
var jiraNamesCount = jiraNames.length;


// Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);


// Initialize on "load"
$(document).ready(function() {

    $('body').prepend("<div id='jxTimer' class='jxBtnOff jxBtnCopy'><span id='jxTimerText'>Start</span></div>");
    document.getElementById("jxTimer").addEventListener (
        "click", timer_click, false
    );

    $('body').prepend("<div id='jxClock'><span id='jxClockText'></span></div>");
    clock_init();

    // Replace Jira IDs, but wait a bit so they're loaded
    setTimeout(replaceJiraIdWithNumber, 500);
    //setTimeout(replaceJiraIdWithName, 500);

});


/**
 * Replace 5-digit Jira Identifiers with 3 digits
 */
function replaceJiraIdWithNumber() {
    $("div.ghx-key:not('.jxJiraNameSkip')").each(function() {
        $(this).addClass('jxJiraNameSkip');
        if ($(this).length<1) return;
        var child = $(this).children('.js-key-link').first();
        if (child.length<1) return;
        var key = child.attr('title');
        if (key.length<1) return;

        var list = key.split("-",2);
        var project = list[0];
        var id = list[1];
        var shortId = pad3(Number(id)%1000);

        var spanTop = $('<span/>');
        spanTop.addClass('ghx-issue-key-link');

        var spanName = $('<span/>');
        spanName.addClass('js-key-link');
        spanName.addClass('jxJiraName');
        spanName.text(project+"-"+shortId);
        spanTop.append(spanName);

        child.empty();
        child.append(spanTop);
    });
    setTimeout(replaceJiraIdWithNumber, 1000);
}


/**
 * Replace 5-digit Jira Identifiers with a human-readable name
 */
function replaceJiraIdWithName() {
    $("div.ghx-key:not('.jxJiraNameSkip')").each(function() {
        $(this).addClass('jxJiraNameSkip');
        if ($(this).length<1) return;
        var child = $(this).children('.js-key-link').first();
        if (child.length<1) return;
        var key = child.attr('title');
        if (key.length<1) return;

        var list = key.split("-",2);
        var project = list[0];
        var id = list[1];
        var name = jiraNames[parseInt(id) % jiraNamesCount];

        var spanTop = $('<span/>');
        spanTop.addClass('ghx-issue-key-link');

        var spanName = $('<span/>');
        spanName.addClass('js-key-link');
        spanName.addClass('jxJiraName');
        spanName.text(name);
        spanTop.append(spanName);

        var spanKey = $('<span/>');
        spanKey.addClass('js-key-link');
        spanKey.text(key);
        spanTop.append(spanKey);

        child.empty();
        child.append(spanTop);
    });
    setTimeout(replaceJiraIDs, 1000);
}


/**
 * Clock features - show a count-down clock counting to the half-hour
 */
function clock_init() {
    setInterval(clock_show, 1000);
    var now = new Date().getTime();
    var over = now % MillisPerHalfHour;
    var start = now - over;
    jxTargetTime = start + MillisPerHalfHour;
    var delay = 0 - Math.trunc(over / 1000);
    $('#jxClock').css('animation-delay',delay+'s');
    clock_show();
}

function clock_show() {
    var text;
    var time = new Date().getTime();
    var secondsLeft = Math.trunc((jxTargetTime - time)/1000);
    if (secondsLeft < 0) text = "End";
    else {
        var minutes = Math.trunc(secondsLeft / 60);
        var seconds = pad(secondsLeft % 60);
        text = minutes+":"+seconds;
    }
    $('#jxClockText').text(text);
}


/**
 * Timer features - keep a count-up timer to capture how long the actual scrum takes, click to click
 */
function timer_click() {
    jxThisClickTime = new Date().getTime();

    // RESET
    if (jxThisClickTime-jxLastClickTime < 250) {
        jxBankedTime=0;
        timer_clear();
        $('#jxTimerText').text('Start');
    }

    // START
    else if (!jxRunning) {
        jxInterval = setInterval(timer_spin, 83);
        $('#jxTimer').addClass('jxBtnOn');
        $('#jxTimer').removeClass('jxBtnOff');
        jxRunning = true;
    }

    // STOP
    else {
        jxBankedTime += jxThisClickTime - jxLastClickTime;
        timer_clear();
        timer_show();
    }

    jxLastClickTime = jxThisClickTime;
}

function timer_clear() {
    clearInterval(jxInterval);
    $('#jxTimer').addClass('jxBtnOff');
    $('#jxTimer').removeClass('jxBtnOn');
    jxRunning = false;
}

function timer_spin() {
    var index = Math.trunc((new Date().getTime() % 1000) / 125);
    $('#jxTimerText').text(Clocks[index]);
}

function timer_show() {
    var delta = jxBankedTime;
    delta %= MillisPerHour;

    var jxMin = Math.floor(delta/MillisPerMinute);
    delta %= MillisPerMinute;
    var jxSec = pad(Math.floor(delta/MillisPerSecond));
    delta %= MillisPerSecond;

    $('#jxTimerText').text(jxMin+":"+jxSec);

    var d = new Date();
    var date = pad(d.getMonth()+1)+"/"+pad(d.getDate());
    var time = pad(jxMin)+":"+jxSec;
    $('#jxTimerText').attr('data-clipboard-text',date+" - "+time);
}


/**
 * Utility features
 */
function pad(x) {
    return (x<10) ? '0'+x : x;
}
function pad3(x) {
    return (x<100) ? (x<10 ? '00'+x : '0'+x) : x;
}