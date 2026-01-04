// ==UserScript==
// @name         MooMoo.io Worthless Bots
// @version      1.0
// @description  Creates bad bots
// @author       | API by Nuro | Main work by Joe | Link: discord.gg/NMS3YR9Q5R
// @match        *://*.moomoo.io/*
// @require       https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144167
// @run-at       document-end
// @icon https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @namespace https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/460153/MooMooio%20Worthless%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/460153/MooMooio%20Worthless%20Bots.meta.js
// ==/UserScript==
/*
Support us on social media (follow and leave a star)

GitHub: https://moomooforge.github.io/MooMoo.js/
Author: https://github.com/NuroC
YouTube: https://www.youtube.com/@nuro9607
Discord: https://discord.gg/NMS3YR9Q5R

Features:

Bots can:

Autoheal
Autoupgrade
Autoattack
Join a clan
Leave a clan
Disconnect (doesn't always work)
Follow a set coordinate or your player.


*/
// https://moomooforge.github.io/MooMoo.js/
const MooMoo = (function () {})[69];
function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}
var chosenBotItem
// New variables
var botTarget = true
var botTargetX
var botTargetY
var Combat = false
var attackPlayer = false
var TargetTeam
var ConnectedBots = 0

const botNames = ["Emma","Isabella","Emily","Madison","Ava","Olivia","Sophia","Abigail","Elizabeth","Chloe","Samantha","Addison","Natalie","Mia","Alexis","Alyssa","Hannah","Ashley","Ella","Sarah","Grace","Taylor","Brianna","Lily","Hailey","Anna","Victoria","Kayla","Lillian","Lauren","Kaylee","Allison","Savannah","Nevaeh","Gabriella","Sofia","Makayla","Avery","Riley","Julia","Leah","Aubrey","Jasmine","Audrey","Katherine","Morgan","Brooklyn","Destiny","Sydney","Alexa","Kylie","Brooke","Kaitlyn","Evelyn","Layla","Madeline","Kimberly","Zoe","Jessica","Peyton","Alexandra","Claire","Madelyn","Maria","Mackenzie","Arianna","Jocelyn","Amelia","Angelina","Trinity","Andrea","Maya","Valeria","Sophie","Rachel","Vanessa","Aaliyah","Mariah","Gabrielle","Katelyn","Ariana","Bailey","Camila","Jennifer","Melanie","Gianna","Charlotte","Paige","Autumn","Payton","Faith","Sara","Isabelle","Caroline","Genesis","Isabel","Mary","Zoey","Gracie","Megan","Haley","Mya","Michelle","Molly","Stephanie","Nicole","Jenna","Natalia","Sadie","Jada","Serenity","Lucy","Ruby","Eva","Kennedy","Rylee","Jayla","Naomi","Rebecca","Lydia","Daniela","Bella","Keira","Adriana","Lilly","Hayden","Miley","Katie","Jade","Jordan","Gabriela","Amy","Angela","Melissa","Valerie","Giselle","Diana","Amanda","Kate","Laila","Reagan","Jordyn","Kylee","Danielle","Briana","Marley","Leslie","Kendall","Catherine","Liliana","Mckenzie","Jacqueline","Ashlyn","Reese","Marissa","London","Juliana","Shelby","Cheyenne","Angel","Daisy","Makenzie","Miranda","Erin","Amber","Alana","Ellie","Breanna","Ana","Mikayla","Summer","Piper","Adrianna","Jillian","Sierra","Jayden","Sienna","Alicia","Lila","Margaret","Alivia","Brooklynn","Karen","Violet","Sabrina","Stella","Aniyah","Annabelle","Alexandria","Kathryn","Skylar","Aliyah","Delilah","Julianna","Kelsey","Khloe","Carly","Amaya","Mariana","Christina","Alondra","Tessa","Eliana","Bianca","Jazmin","Clara","Vivian","Josephine","Delaney","Scarlett","Elena","Cadence","Alexia","Maggie","Laura","Nora","Ariel","Elise","Nadia","Mckenna","Chelsea","Lyla","Alaina","Jasmin","Hope","Leila","Caitlyn","Cassidy","Makenna","Allie","Izabella","Eden","Callie","Haylee","Caitlin","Kendra","Karina","Kyra","Kayleigh","Addyson","Kiara","Jazmine","Karla","Camryn","Alina","Lola","Kyla","Kelly","Fatima","Tiffany","Kira","Crystal","Mallory","Esmeralda","Alejandra","Eleanor","Angelica","Jayda","Abby","Kara","Veronica","Carmen","Jamie","Ryleigh","Valentina","Allyson","Dakota","Kamryn","Courtney","Cecilia","Madeleine","Aniya","Alison","Esther","Heaven","Aubree","Lindsey","Leilani","Nina","Melody","Macy","Ashlynn","Joanna","Cassandra","Alayna","Kaydence","Madilyn","Aurora","Heidi","Emerson","Kimora","Madalyn","Erica","Josie","Katelynn","Guadalupe","Harper","Ivy","Lexi","Camille","Savanna","Dulce","Daniella","Lucia","Emely","Joselyn","Kiley","Kailey","Miriam","Cynthia","Rihanna","Georgia","Rylie","Harmony","Kiera","Kyleigh","Monica","Bethany","Kaylie","Cameron","Teagan","Cora","Brynn","Ciara","Genevieve","Alice","Maddison","Eliza","Tatiana","Jaelyn","Erika","Ximena","April","Marely","Julie","Danica","Presley","Brielle","Julissa","Angie","Iris","Brenda","Hazel","Rose","Malia","Shayla","Fiona","Phoebe","Nayeli","Paola","Kaelyn","Selena","Audrina","Rebekah","Carolina","Janiyah","Michaela","Penelope","Janiya","Anastasia","Adeline","Ruth","Sasha","Denise","Holly","Madisyn","Hanna","Tatum","Marlee","Nataly","Helen","Janelle","Lizbeth","Serena","Anya","Jaslene","Kaylin","Jazlyn","Nancy","Lindsay","Desiree","Hayley","Itzel","Imani","Madelynn","Asia","Kadence","Madyson","Talia","Jane","Kayden","Annie","Amari","Bridget","Raegan","Jadyn","Celeste","Jimena","Luna","Yasmin","Emilia","Annika","Estrella","Sarai","Lacey","Ayla","Alessandra","Willow","Nyla","Dayana","Lilah","Lilliana","Natasha","Hadley","Harley","Priscilla","Claudia","Allisson","Baylee","Brenna","Brittany","Skyler","Fernanda","Danna","Melany","Cali","Lia","Macie","Lyric","Logan","Gloria","Lana","Mylee","Cindy","Lilian","Amira","Anahi","Alissa","Anaya","Lena","Ainsley","Sandra","Noelle","Marisol","Meredith","Kailyn","Lesly","Johanna","Diamond","Evangeline","Juliet","Kathleen","Meghan","Paisley","Athena","Hailee","Rosa","Wendy","Emilee","Sage","Alanna","Elaina","Cara","Nia","Paris","Casey","Dana","Emery","Rowan","Aubrie","Kaitlin","Jaden","Kenzie","Kiana","Viviana","Norah","Lauryn","Perla","Amiyah","Alyson","Rachael","Shannon","Aileen","Miracle","Lillie","Danika","Heather","Kassidy","Taryn","Tori","Francesca","Kristen","Amya","Elle","Kristina","Cheyanne","Haylie","Patricia","Anne","Samara","Skye","Kali","America","Lexie","Parker","Halle","Londyn","Abbigail","Linda","Hallie","Saniya","Bryanna","Bailee","Jaylynn","Mckayla","Quinn","Jaelynn","Jaida","Caylee","Jaiden","Melina","Abril","Sidney","Kassandra","Elisabeth","Adalyn","Kaylynn","Mercedes","Yesenia","Elliana","Brylee","Dylan","Isabela","Ryan","Ashlee","Daphne","Kenya","Marina","Christine","Mikaela","Kaitlynn","Justice","Saniyah","Jaliyah","Ingrid","Marie","Natalee","Joy","Juliette","Simone","Adelaide","Krystal","Kennedi","Mila","Tamia","Addisyn","Aylin","Dayanara","Sylvia","Clarissa","Maritza","Virginia","Braelyn","Jolie","Jaidyn","Kinsley","Kirsten","Laney","Marilyn","Whitney","Janessa","Raquel","Anika","Kamila","Aria","Rubi","Adelyn","Amara","Ayanna","Teresa","Zariah","Kaleigh","Amani","Carla","Yareli","Gwendolyn","Paulina","Nathalie","Annabella","Jaylin","Tabitha","Deanna","Madalynn","Journey","Aiyana","Skyla","Yaretzi","Ada","Liana","Karlee","Jenny","Myla","Cristina","Myah","Lisa","Tania","Isis","Jayleen","Jordin","Arely","Azul","Helena","Aryanna","Jaqueline","Lucille","Destinee","Martha","Zoie","Arielle","Liberty","Marlene","Elisa","Isla","Noemi","Raven","Jessie","Aleah","Kailee","Kaliyah","Lilyana","Haven","Tara","Giana","Camilla","Maliyah","Irene","Carley","Maeve","Lea","Macey","Sharon","Alisha","Marisa","Jaylene","Kaya","Scarlet","Siena","Adyson","Maia","Shiloh","Tiana","Jaycee","Gisselle","Yazmin","Eve","Shyanne","Arabella","Sherlyn","Sariah","Amiya","Kiersten","Madilynn","Shania","Aleena","Finley","Kinley","Kaia","Aliya","Taliyah","Pamela","Yoselin","Ellen","Carlie","Monserrat","Jakayla","Reyna","Yaritza","Carolyn","Clare","Lorelei","Paula","Zaria","Gracelyn","Kasey","Regan","Alena","Angelique","Regina","Britney","Emilie","Mariam","Jaylee","Julianne","Greta","Elyse","Lainey","Kallie","Felicity","Zion","Aspen","Carlee","Annalise","Iliana","Larissa","Akira","Sonia","Catalina","Phoenix","Joslyn","Anabelle","Mollie","Susan","Judith","Destiney","Hillary","Janet","Katrina","Mareli","Ansley","Kaylyn","Alexus","Gia","Maci","Elsa","Stacy","Kaylen","Carissa","Haleigh","Lorena","Jazlynn","Milagros","Luz","Leanna","Renee","Shaniya","Charlie","Abbie","Cailyn","Cherish","Elsie","Jazmyn","Elaine","Emmalee","Luciana","Dahlia","Jamya","Belinda","Mariyah","Chaya","Dayami","Rhianna","Yadira","Aryana","Rosemary","Armani","Cecelia","Celia","Barbara","Cristal","Eileen","Rayna","Campbell","Amina","Aisha","Amirah","Ally","Araceli","Averie","Mayra","Sanaa","Patience","Leyla","Selah","Zara","Chanel","Kaiya","Keyla","Miah","Aimee","Giovanna","Amelie","Kelsie","Alisson","Angeline","Dominique","Adrienne","Brisa","Cierra","Paloma","Isabell","Precious","Alma","Charity","Jacquelyn","Janae","Frances","Shyla","Janiah","Kierra","Karlie","Annabel","Jacey","Karissa","Jaylah","Xiomara","Edith","Marianna","Damaris","Deborah","Jaylyn","Evelin","Mara","Olive","Ayana","India","Kendal","Kayley","Tamara","Briley","Charlee","Nylah","Abbey","Moriah","Saige","Savanah","Giada","Hana","Lizeth","Matilda","Ann","Jazlene","Gillian","Beatrice","Ireland","Karly","Mylie","Yasmine","Ashly","Kenna","Maleah","Corinne","Keely","Tanya","Tianna","Adalynn","Ryann","Salma","Areli","Karma","Shyann","Kaley","Theresa","Evie","Gina","Roselyn","Kaila","Jaylen","Natalya","Meadow","Rayne","Aliza","Yuliana","June","Lilianna","Nathaly","Ali","Alisa","Aracely","Belen","Tess","Jocelynn","Litzy","Makena","Abagail","Giuliana","Joyce","Libby","Lillianna","Thalia","Tia","Sarahi","Zaniyah","Kristin","Lorelai","Mattie","Taniya","Jaslyn","Gemma","Valery","Lailah","Mckinley","Micah","Deja","Frida","Brynlee","Jewel","Krista","Mira","Yamilet","Adison","Carina","Karli","Magdalena","Stephany","Charlize","Raelynn","Aliana","Cassie","Mina","Karley","Shirley","Marlie","Alani","Taniyah","Cloe","Sanai","Lina","Nola","Anabella","Dalia","Raina","Mariela","Ariella","Bria","Kamari","Monique","Ashleigh","Reina","Alia","Ashanti","Lara","Lilia","Justine","Leia","Maribel","Abigayle","Tiara","Alannah","Princess","Sydnee","Kamora","Paityn","Payten","Naima","Gretchen","Heidy","Nyasia","Livia","Marin","Shaylee","Maryjane","Laci","Nathalia","Azaria","Anabel","Chasity","Emmy","Izabelle","Denisse","Emelia","Mireya","Shea","Amiah","Dixie","Maren","Averi","Esperanza","Micaela","Selina","Alyvia","Chana","Avah","Donna","Kaylah","Ashtyn","Karsyn","Makaila","Shayna","Essence","Leticia","Miya","Rory","Desirae","Kianna","Laurel","Neveah","Amaris","Hadassah","Dania","Hailie","Jamiya","Kathy","Laylah","Riya","Diya","Carleigh","Iyana","Kenley","Sloane","Elianna","Jacob","Michael","Ethan","Joshua","Daniel","Alexander","Anthony","William","Christopher","Matthew","Jayden","Andrew","Joseph","David","Noah","Aiden","James","Ryan","Logan","John","Nathan","Elijah","Christian","Gabriel","Benjamin","Jonathan","Tyler","Samuel","Nicholas","Gavin","Dylan","Jackson","Brandon","Caleb","Mason","Angel","Isaac","Evan","Jack","Kevin","Jose","Isaiah","Luke","Landon","Justin","Lucas","Zachary","Jordan","Robert","Aaron","Brayden","Thomas","Cameron","Hunter","Austin","Adrian","Connor","Owen","Aidan","Jason","Julian","Wyatt","Charles","Luis","Carter","Juan","Chase","Diego","Jeremiah","Brody","Xavier","Adam","Carlos","Sebastian","Liam","Hayden","Nathaniel","Henry","Jesus","Ian","Tristan","Bryan","Sean","Cole","Alex","Eric","Brian","Jaden","Carson","Blake","Ayden","Cooper","Dominic","Brady","Caden","Josiah","Kyle","Colton","Kaden","Eli","Miguel","Antonio","Parker","Steven","Alejandro","Riley","Richard","Timothy","Devin","Jesse","Victor","Jake","Joel","Colin","Kaleb","Bryce","Levi","Oliver","Oscar","Vincent","Ashton","Cody","Micah","Preston","Marcus","Max","Patrick","Seth","Jeremy","Peyton","Nolan","Ivan","Damian","Maxwell","Alan","Kenneth","Jonah","Jorge","Mark","Giovanni","Eduardo","Grant","Collin","Gage","Omar","Emmanuel","Trevor","Edward","Ricardo","Cristian","Nicolas","Kayden","George","Jaxon","Paul","Braden","Elias","Andres","Derek","Garrett","Tanner","Malachi","Conner","Fernando","Cesar","Javier","Miles","Jaiden","Alexis","Leonardo","Santiago","Francisco","Cayden","Shane","Edwin","Hudson","Travis","Bryson","Erick","Jace","Hector","Josue","Peter","Jaylen","Mario","Manuel","Abraham","Grayson","Damien","Kaiden","Spencer","Stephen","Edgar","Wesley","Shawn","Trenton","Jared","Jeffrey","Landen","Johnathan","Bradley","Braxton","Ryder","Camden","Roman","Asher","Brendan","Maddox","Sergio","Israel","Andy","Lincoln","Erik","Donovan","Raymond","Avery","Rylan","Dalton","Harrison","Andre","Martin","Keegan","Marco","Jude","Sawyer","Dakota","Leo","Calvin","Kai","Drake","Troy","Zion","Clayton","Roberto","Zane","Gregory","Tucker","Rafael","Kingston","Dominick","Ezekiel","Griffin","Devon","Drew","Lukas","Johnny","Ty","Pedro","Tyson","Caiden","Mateo","Braylon","Cash","Aden","Chance","Taylor","Marcos","Maximus","Ruben","Emanuel","Simon","Corbin","Brennan","Dillon","Skyler","Myles","Xander","Jaxson","Dawson","Kameron","Kyler","Axel","Colby","Jonas","Joaquin","Payton","Brock","Frank","Enrique","Quinn","Emilio","Malik","Grady","Angelo","Julio","Derrick","Raul","Fabian","Corey","Gerardo","Dante","Ezra","Armando","Allen","Theodore","Gael","Amir","Zander","Adan","Maximilian","Randy","Easton","Dustin","Luca","Phillip","Julius","Charlie","Ronald","Jakob","Cade","Brett","Trent","Silas","Keith","Emiliano","Trey","Jalen","Darius","Lane","Jerry","Jaime","Scott","Graham","Weston","Braydon","Anderson","Rodrigo","Pablo","Saul","Danny","Donald","Elliot","Brayan","Dallas","Lorenzo","Casey","Mitchell","Alberto","Tristen","Rowan","Jayson","Gustavo","Aaden","Amari","Dean","Braeden","Declan","Chris","Ismael","Dane","Louis","Arturo","Brenden","Felix","Jimmy","Cohen","Tony","Holden","Reid","Abel","Bennett","Zackary","Arthur","Nehemiah","Ricky","Esteban","Cruz","Finn","Mauricio","Dennis","Keaton","Albert","Marvin","Mathew","Larry","Moises","Issac","Philip","Quentin","Curtis","Greyson","Jameson","Everett","Jayce","Darren","Elliott","Uriel","Alfredo","Hugo","Alec","Jamari","Marshall","Walter","Judah","Jay","Lance","Beau","Ali","Landyn","Yahir","Phoenix","Nickolas","Kobe","Bryant","Maurice","Russell","Leland","Colten","Reed","Davis","Joe","Ernesto","Desmond","Kade","Reece","Morgan","Ramon","Rocco","Orlando","Ryker","Brodie","Paxton","Jacoby","Douglas","Kristopher","Gary","Lawrence","Izaiah","Solomon","Nikolas","Mekhi","Justice","Tate","Jaydon","Salvador","Shaun","Alvin","Eddie","Kane","Davion","Zachariah","Dorian","Titus","Kellen","Camron","Isiah","Javon","Nasir","Milo","Johan","Byron","Jasper","Jonathon","Chad","Marc","Kelvin","Chandler","Sam","Cory","Deandre","River","Reese","Roger","Quinton","Talon","Romeo","Franklin","Noel","Alijah","Guillermo","Gunner","Damon","Jadon","Emerson","Micheal","Bruce","Terry","Kolton","Melvin","Beckett","Porter","August","Brycen","Dayton","Jamarion","Leonel","Karson","Zayden","Keagan","Carl","Khalil","Cristopher","Nelson","Braiden","Moses","Isaias","Roy","Triston","Walker","Kale","Jermaine","Leon","Rodney","Kristian","Mohamed","Ronan","Pierce","Trace","Warren","Jeffery","Maverick","Cyrus","Quincy","Nathanael","Skylar","Tommy","Conor","Noe","Ezequiel","Demetrius","Jaylin","Kendrick","Frederick","Terrance","Bobby","Jamison","Jon","Rohan","Jett","Kieran","Tobias","Ari","Colt","Gideon","Felipe","Kenny","Wilson","Orion","Kamari","Gunnar","Jessie","Alonzo","Gianni","Omari","Waylon","Malcolm","Emmett","Abram","Julien","London","Tomas","Allan","Terrell","Matteo","Tristin","Jairo","Reginald","Brent","Ahmad","Yandel","Rene","Willie","Boston","Billy","Marlon","Trevon","Aydan","Jamal","Aldo","Ariel","Cason","Braylen","Javion","Joey","Rogelio","Ahmed","Dominik","Brendon","Toby","Kody","Marquis","Ulises","Armani","Adriel","Alfonso","Branden","Will","Craig","Ibrahim","Osvaldo","Wade","Harley","Steve","Davin","Deshawn","Kason","Damion","Jaylon","Jefferson","Aron","Brooks","Darian","Gerald","Rolando","Terrence","Enzo","Kian","Ryland","Barrett","Jaeden","Ben","Bradyn","Giovani","Blaine","Madden","Jerome","Muhammad","Ronnie","Layne","Kolby","Leonard","Vicente","Cale","Alessandro","Zachery","Gavyn","Aydin","Xzavier","Malakai","Raphael","Cannon","Rudy","Asa","Darrell","Giancarlo","Elisha","Junior","Zackery","Alvaro","Lewis","Valentin","Deacon","Jase","Harry","Kendall","Rashad","Finnegan","Mohammed","Ramiro","Cedric","Brennen","Santino","Stanley","Tyrone","Chace","Francis","Johnathon","Teagan","Zechariah","Alonso","Kaeden","Kamden","Gilberto","Ray","Karter","Luciano","Nico","Kole","Aryan","Draven","Jamie","Misael","Lee","Alexzander","Camren","Giovanny","Amare","Rhett","Rhys","Rodolfo","Nash","Markus","Deven","Mohammad","Moshe","Quintin","Dwayne","Memphis","Atticus","Davian","Eugene","Jax","Antoine","Wayne","Randall","Semaj","Uriah","Clark","Aidyn","Jorden","Maxim","Aditya","Lawson","Messiah","Korbin","Sullivan","Freddy","Demarcus","Neil","Brice","King","Davon","Elvis","Ace","Dexter","Heath","Duncan","Jamar","Sincere","Irvin","Remington","Kadin","Soren","Tyree","Damarion","Talan","Adrien","Gilbert","Keenan","Darnell","Adolfo","Tristian","Derick","Isai","Rylee","Gauge","Harold","Kareem","Deangelo","Agustin","Coleman","Zavier","Lamar","Emery","Jaydin","Devan","Jordyn","Mathias","Prince","Sage","Seamus","Jasiah","Efrain","Darryl","Arjun","Mike","Roland","Conrad","Kamron","Hamza","Santos","Frankie","Dominique","Marley","Vance","Dax","Jamir","Kylan","Todd","Maximo","Jabari","Matthias","Haiden","Luka","Marcelo","Keon","Layton","Tyrell","Kash","Raiden","Cullen","Donte","Jovani","Cordell","Kasen","Rory","Alfred","Darwin","Ernest","Bailey","Gaige","Hassan","Jamarcus","Killian","Augustus","Trevin","Zain","Ellis","Rex","Yusuf","Bruno","Jaidyn","Justus","Ronin","Humberto","Jaquan","Josh","Kasey","Winston","Dashawn","Lucian","Matias","Sidney","Ignacio","Nigel","Van","Elian","Finley","Jaron","Addison","Aedan","Braedon","Jadyn","Konner","Zayne","Franco","Niko","Savion","Cristofer","Deon","Krish","Anton","Brogan","Cael","Coby","Kymani","Marcel","Yair","Dale","Bo","Jordon","Samir","Darien","Zaire","Ross","Vaughn","Devyn","Kenyon","Clay","Dario","Ishaan","Jair","Kael","Adonis","Jovanny","Clinton","Rey","Chaim","German","Harper","Nathen","Rigoberto","Sonny","Glenn","Octavio","Blaze","Keshawn","Ralph","Ean","Nikhil","Rayan","Sterling","Branson","Jadiel","Dillan","Jeramiah","Koen","Konnor","Antwan","Houston","Tyrese","Dereon","Leonidas","Zack","Fisher","Jaydan","Quinten","Nick","Urijah","Darion","Jovan","Salvatore","Beckham","Jarrett","Antony","Eden","Makai","Zaiden","Broderick","Camryn","Malaki","Nikolai","Howard","Immanuel","Demarion","Valentino","Jovanni","Ayaan","Ethen","Leandro","Royce","Yael","Yosef","Jean","Marquise","Alden","Leroy","Gaven","Jovany","Tyshawn","Aarav","Kadyn","Milton","Zaid","Kelton","Tripp","Kamren","Slade","Hezekiah","Jakobe","Nathanial","Rishi","Shamar","Geovanni","Pranav","Roderick","Bentley","Clarence","Lyric","Bernard","Carmelo","Denzel","Maximillian","Reynaldo","Cassius","Gordon","Reuben","Samson","Yadiel","Jayvon","Reilly","Sheldon","Abdullah","Jagger","Thaddeus","Case","Kyson","Lamont","Chaz","Makhi","Jan","Marques","Oswaldo","Donavan","Keyon","Kyan","Simeon","Trystan","Andreas","Dangelo","Landin","Reagan","Turner","Arnav","Brenton","Callum","Jayvion","Bridger","Sammy","Deegan","Jaylan","Lennon","Odin","Abdiel","Jerimiah","Eliezer","Bronson","Cornelius","Pierre","Cortez","Baron","Carlo","Carsen","Fletcher","Izayah","Kolten","Damari","Hugh","Jensen","Yurem"]
const botLastNames = ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Garcia","Rodriguez","Wilson","Martinez","Anderson","Taylor","Thomas","Hernandez","Moore","Martin","Jackson","Thompson","White","Lopez","Lee","Gonzalez","Harris","Clark","Lewis","Robinson","Walker","Perez","Hall","Young","Allen","Sanchez","Wright","King","Scott","Green","Baker","Adams","Nelson","Hill","Ramirez","Campbell","Mitchell","Roberts","Carter","Phillips","Evans","Turner","Torres","Parker","Collins","Edwards","Stewart","Flores","Morris","Nguyen","Murphy","Rivera","Cook","Rogers","Morgan","Peterson","Cooper","Reed","Bailey","Bell","Gomez","Kelly","Howard","Ward","Cox","Diaz","Richardson","Wood","Watson","Brooks","Bennett","Gray","James","Reyes","Cruz","Hughes","Price","Myers","Long","Foster","Sanders","Ross","Morales","Powell","Sullivan","Russell","Ortiz","Jenkins","Gutierrez","Perry","Butler","Barnes","Fisher","Henderson","Coleman","Simmons","Patterson","Jordan","Reynolds","Hamilton","Graham","Kim","Gonzales","Alexander","Ramos","Wallace","Griffin","West","Cole","Hayes","Chavez","Gibson","Bryant","Ellis","Stevens","Murray","Ford","Marshall","Owens","Mcdonald","Harrison","Ruiz","Kennedy","Wells","Alvarez","Woods","Mendoza","Castillo","Olson","Webb","Washington","Tucker","Freeman","Burns","Henry","Vasquez","Snyder","Simpson","Crawford","Jimenez","Porter","Mason","Shaw","Gordon","Wagner","Hunter","Romero","Hicks","Dixon","Hunt","Palmer","Robertson","Black","Holmes","Stone","Meyer","Boyd","Mills","Warren","Fox","Rose","Rice","Moreno","Schmidt","Patel","Ferguson","Nichols","Herrera","Medina","Ryan","Fernandez","Weaver","Daniels","Stephens","Gardner","Payne","Kelley","Dunn","Pierce","Arnold","Tran","Spencer","Peters","Hawkins","Grant","Hansen","Castro","Hoffman","Hart","Elliott","Cunningham","Knight","Bradley","Carroll","Hudson","Duncan","Armstrong","Berry","Andrews","Johnston","Ray","Lane","Riley","Carpenter","Perkins","Aguilar","Silva","Richards","Willis","Matthews","Chapman","Lawrence","Garza","Vargas","Watkins","Wheeler","Larson","Carlson","Harper","George","Greene","Burke","Guzman","Morrison","Munoz","Jacobs","Obrien","Lawson","Franklin","Lynch","Bishop","Carr","Salazar","Austin","Mendez","Gilbert","Jensen","Williamson","Montgomery","Harvey","Oliver","Howell","Dean","Hanson","Weber","Garrett","Sims","Burton","Fuller","Soto","Mccoy","Welch","Chen","Schultz","Walters","Reid","Fields","Walsh","Little","Fowler","Bowman","Davidson","May","Day","Schneider","Newman","Brewer","Lucas","Holland","Wong","Banks","Santos","Curtis","Pearson","Delgado","Valdez","Pena","Rios","Douglas","Sandoval","Barrett","Hopkins","Keller","Guerrero","Stanley","Bates","Alvarado","Beck","Ortega","Wade","Estrada","Contreras","Barnett","Caldwell","Santiago","Lambert","Powers","Chambers","Nunez","Craig","Leonard","Lowe","Rhodes","Byrd","Gregory","Shelton","Frazier","Becker","Maldonado","Fleming","Vega","Sutton","Cohen","Jennings","Parks","Mcdaniel","Watts","Barker","Norris","Vaughn","Vazquez","Holt","Schwartz","Steele","Benson","Neal","Dominguez","Horton","Terry","Wolfe","Hale","Lyons","Graves","Haynes","Miles","Park","Warner","Padilla","Bush","Thornton","Mccarthy","Mann","Zimmerman","Erickson","Fletcher","Mckinney","Page","Dawson","Joseph","Marquez","Reeves","Klein","Espinoza","Baldwin","Moran","Love","Robbins","Higgins","Ball","Cortez","Le","Griffith","Bowen","Sharp","Cummings","Ramsey","Hardy","Swanson","Barber","Acosta","Luna","Chandler","Blair","Daniel","Cross","Simon","Dennis","Oconnor","Quinn","Gross","Navarro","Moss","Fitzgerald","Doyle","Mclaughlin","Rojas","Rodgers","Stevenson","Singh","Yang","Figueroa","Harmon","Newton","Paul","Manning","Garner","Mcgee","Reese","Francis","Burgess","Adkins","Goodman","Curry","Brady","Christensen","Potter","Walton","Goodwin","Mullins","Molina","Webster","Fischer","Campos","Avila","Sherman","Todd","Chang","Blake","Malone","Wolf","Hodges","Juarez","Gill","Farmer","Hines","Gallagher","Duran","Hubbard","Cannon","Miranda","Wang","Saunders","Tate","Mack","Hammond","Carrillo","Townsend","Wise","Ingram","Barton","Mejia","Ayala","Schroeder","Hampton","Rowe","Parsons","Frank","Waters","Strickland","Osborne","Maxwell","Chan","Deleon","Norman","Harrington","Casey","Patton","Logan","Bowers","Mueller","Glover","Floyd","Hartman","Buchanan","Cobb","French","Kramer","Mccormick","Clarke","Tyler","Gibbs","Moody","Conner","Sparks","Mcguire","Leon","Bauer","Norton","Pope","Flynn","Hogan","Robles","Salinas","Yates","Lindsey","Lloyd","Marsh","Mcbride","Owen","Solis","Pham","Lang","Pratt","Lara","Brock","Ballard","Trujillo","Shaffer","Drake","Roman","Aguirre","Morton","Stokes","Lamb","Pacheco","Patrick","Cochran","Shepherd","Cain","Burnett","Hess","Li","Cervantes","Olsen","Briggs","Ochoa","Cabrera","Velasquez","Montoya","Roth","Meyers","Cardenas","Fuentes","Weiss","Hoover","Wilkins","Nicholson","Underwood","Short","Carson","Morrow","Colon","Holloway","Summers","Bryan","Petersen","Mckenzie","Serrano","Wilcox","Carey","Clayton","Poole","Calderon","Gallegos","Greer","Rivas","Guerra","Decker","Collier","Wall","Whitaker","Bass","Flowers","Davenport","Conley","Houston","Huff","Copeland","Hood","Monroe","Massey","Roberson","Combs","Franco","Larsen","Pittman","Randall","Skinner","Wilkinson","Kirby","Cameron","Bridges","Anthony","Richard","Kirk","Bruce","Singleton","Mathis","Bradford","Boone","Abbott","Charles","Allison","Sweeney","Atkinson","Horn","Jefferson","Rosales","York","Christian","Phelps","Farrell","Castaneda","Nash","Dickerson","Bond","Wyatt","Foley","Chase","Gates","Vincent","Mathews","Hodge","Garrison","Trevino","Villarreal","Heath","Dalton","Valencia","Callahan","Hensley","Atkins","Huffman","Roy","Boyer","Shields","Lin","Hancock","Grimes","Glenn","Cline","Delacruz","Camacho","Dillon","Parrish","Oneill","Melton","Booth","Kane","Berg","Harrell","Pitts","Savage","Wiggins","Brennan","Salas","Marks","Russo","Sawyer","Baxter","Golden","Hutchinson","Liu","Walter","Mcdowell","Wiley","Rich","Humphrey","Johns","Koch","Suarez","Hobbs","Beard","Gilmore","Ibarra","Keith","Macias","Khan","Andrade","Ware","Stephenson","Henson","Wilkerson","Dyer","Mcclure","Blackwell","Mercado","Tanner","Eaton","Clay","Barron","Beasley","Oneal","Preston","Small","Wu","Zamora","Macdonald","Vance","Snow","Mcclain","Stafford","Orozco","Barry","English","Shannon","Kline","Jacobson","Woodard","Huang","Kemp","Mosley","Prince","Merritt","Hurst","Villanueva","Roach","Nolan","Lam","Yoder","Mccullough","Lester","Santana","Valenzuela","Winters","Barrera","Leach","Orr","Berger","Mckee","Strong","Conway","Stein","Whitehead","Bullock","Escobar","Knox","Meadows","Solomon","Velez","Odonnell","Kerr","Stout","Blankenship","Browning","Kent","Lozano","Bartlett","Pruitt","Buck","Barr","Gaines","Durham","Gentry","Mcintyre","Sloan","Melendez","Rocha","Herman","Sexton","Moon","Hendricks","Rangel","Stark","Lowery","Hardin","Hull","Sellers","Ellison","Calhoun","Gillespie","Mora","Knapp","Mccall","Morse","Dorsey","Weeks","Nielsen","Livingston","Leblanc","Mclean","Bradshaw","Glass","Middleton","Buckley","Schaefer","Frost","Howe","House","Mcintosh","Ho","Pennington","Reilly","Hebert","Mcfarland","Hickman","Noble","Spears","Conrad","Arias","Galvan","Velazquez","Huynh","Frederick","Randolph","Cantu","Fitzpatrick","Mahoney","Peck","Villa","Michael","Donovan","Mcconnell","Walls","Boyle","Mayer","Zuniga","Giles","Pineda","Pace","Hurley","Mays","Mcmillan","Crosby","Ayers","Case","Bentley","Shepard","Everett","Pugh","David","Mcmahon","Dunlap","Bender","Hahn","Harding","Acevedo","Raymond","Blackburn","Duffy","Landry","Dougherty","Bautista","Shah","Potts","Arroyo","Valentine","Meza","Gould","Vaughan","Fry","Rush","Avery","Herring","Dodson","Clements","Sampson","Tapia","Bean","Lynn","Crane","Farley","Cisneros","Benton","Ashley","Mckay","Finley","Best","Blevins","Friedman","Moses","Sosa","Blanchard","Huber","Frye","Krueger","Bernard","Rosario","Rubio","Mullen","Benjamin","Haley","Chung","Moyer","Choi","Horne","Yu","Woodward","Ali","Nixon","Hayden","Rivers","Estes","Mccarty","Richmond","Stuart","Maynard","Brandt","Oconnell","Hanna","Sanford","Sheppard","Church","Burch","Levy","Rasmussen","Coffey","Ponce","Faulkner","Donaldson","Schmitt","Novak","Costa","Montes","Booker","Cordova","Waller","Arellano","Maddox","Mata","Bonilla","Stanton","Compton","Kaufman","Dudley","Mcpherson","Beltran","Dickson","Mccann","Villegas","Proctor","Hester","Cantrell","Daugherty","Cherry","Bray","Davila","Rowland","Levine","Madden","Spence","Good","Irwin","Werner","Krause","Petty","Whitney","Baird","Hooper","Pollard","Zavala","Jarvis","Holden","Haas","Hendrix","Mcgrath","Bird","Lucero","Terrell","Riggs","Joyce","Mercer","Rollins","Galloway","Duke","Odom","Andersen","Downs","Hatfield","Benitez","Archer","Huerta","Travis","Mcneil","Hinton","Zhang","Hays","Mayo","Fritz","Branch","Mooney","Ewing","Ritter","Esparza","Frey","Braun","Gay","Riddle","Haney","Kaiser","Holder","Chaney","Mcknight","Gamble","Vang","Cooley","Carney","Cowan","Forbes","Ferrell","Davies","Barajas","Shea","Osborn","Bright","Cuevas","Bolton","Murillo","Lutz","Duarte","Kidd","Key","Cooke"]
const botColors = [0,1,2,3,4,5,6,7,8,9]

const BOT_NAME = "Worthless bot";
const BOT_SKIN = 8;
const BOT_MOOFOLL = true;
const BOT_CONNECT_EVENT = "connected";
const BOT_PACKET_EVENT = "packet";
const BOT_JOIN_REGION_INDEX = "join";
const BOT_POSITION_UPDATE_INTERVAL = 100;
const BOT_POSITION_UPDATE_PACKET = "33";
const COMMAND_PREFIX = "/";
const COMMAND_NAME_SEND = "send";
const COMMAND_NAME_DISCONECT = "disconnect";
const COMMAND_NAME_POS = "pos";
const COMMAND_NAME_CHOOSE = "choose";
const COMMAND_NAME_TOGGLE = "toggle";
const COMMAND_NAME_ATTACK = "attack";
const COMMAND_NAME_JOIN = "join";
const COMMAND_NAME_LEAVE = "leave";
const COMMAND_NAME_PLAYER_COMBAT = "combat";
const COMMAND_NAME_PLAYER_DEFEND = "defend";
const COMMAND_RESPONSE_SEND = "sending 4 more bots...";
const COMMAND_RESPONSE_DISCONNECT = "disconnecting bots...";
const BOT_COUNT_TO_ADD = 4;
const IP_LIMIT = 4;
const BOT_COUNT = IP_LIMIT - 1;


const botManager = MooMoo.BotManager;
let CommandManager = MooMoo.CommandManager;
let activePlayerManager = MooMoo.ActivePlayerManager;
let players = activePlayerManager.players;

CommandManager.setPrefix(COMMAND_PREFIX);

class Bot {
    static generateBot(botManager) {
        const chosenbotName = getRandomItem(botNames)
        const chosenbotLname = getRandomItem(botLastNames)
        const chosenbotColor = getRandomItem(botColors)
        const bot = new botManager.Bot(true, {
            name: chosenbotName + " " + chosenbotLname,
            skin: chosenbotColor,
            moofoll: BOT_MOOFOLL
        });
        bot.addEventListener(BOT_CONNECT_EVENT, server => {
            bot.spawn();
            bot.ws.addEventListener("message", ({ data }) => {
                const packet = MooMoo.msgpack.decode(new Uint8Array(data))
                let packetID = packet[0]
                let [type, [...args]] = packet;
                if (type == "io-init") {
                    bot.weapons = [0];
                    bot.mats = [0, 3, 6, 10];
                    bot.secondary = null;
                    bot.primary = 0;
                    bot.foodType = 0;
                    bot.wallType = 3;
                    bot.spikeType = 6;
                    bot.millType = 10;
                    bot.boostType = null;
                    bot.mineType = null;
                    bot.turretType = null;
                    bot.spawnpadType = null;
                }
                if (type == "17") {
                    if (args[2]) {
                        bot.weapons = args[1];
                        bot.primary = args[1][0];
                        bot.secondary = args[1][1] || null;
                    } else {
                        bot.mats = args[1];
                        for (let i = 0; i < args[1].length; i++) {
                            for (let i2 = 0; i2 < 3; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.foodType = args[1][i];
                                }
                            }
                            for (let i2 = 3; i2 < 6; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.wallType = args[1][i];
                                }
                            }
                            for (let i2 = 6; i2 < 10; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.spikeType = args[1][i];
                                }
                            }
                            for (let i2 = 10; i2 < 13; i2++) {
                                if (i2 ==args[1][i]) {
                                    bot.millType = args[1][i];
                                }
                            }
                            for (let i2 = 13; i2 < 15; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.mineType = args[1][i];
                                }
                            }
                            for (let i2 = 15; i2 < 17; i2++) {
                                if (i2 == args[1][i]) {
                                    bot.boostType = args[1][i];
                                }
                            }
                            for (let i2 = 17; i2 < 23; i2++) {
                                if (i2 == args[1][i] && i2 !== 20) {
                                    bot.turretType = args[1][i];
                                }
                                if (i2 == args[1][i] && i2 == 20) {
                                    bot.spawnpadType = args[1][i];
                                }
                            }
                        }
                    }
                }
                if (type == "1" && bot.sid == undefined) {
                    bot.sid = args[0];
                }
                if (type == "ch") {
                    let [sid, message] = args;
                    if (message.toLowerCase() == "bad" || message.toLowerCase() == "trash" || message.toLowerCase() == "loser" || message.toLowerCase() == "hacks" || message.toLowerCase() == "imagine hacking" || message.toLowerCase() == "so bad" || message.toLowerCase() == "ez"){
                        const possibleMessages = ["L + ratio + stay mad", "Ok and?", "Deal with it kid" , "Didn't ask; Don't care", "Keep crying", "Skill issue lol", "Nobody cares", "Code your own nerd", "Mad cuz Bad", "Insults won't stop us", "Yeah whatvever, hacking's fun"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                    if (message.toLowerCase() == "how" || message.toLowerCase() == "what mod" || message.toLowerCase() == "what script" || message.toLowerCase() == "share" || message.toLowerCase() == "what hack" || message.toLowerCase() == "what mod?"){
                        const possibleMessages = ["Hacks", "Worthless Bots mod", "Download on greasyfork" , "Edit on gold bots mod", "Beggars be like:", "try again later"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                    if (message.toLowerCase() == "lmao" || message.toLowerCase() == "wtf" || message.toLowerCase() == "lmfao" || message.toLowerCase() == "tf" || message.toLowerCase() == "omg" || message.toLowerCase() == "how tf" || message.toLowerCase() == "omfg" || message.toLowerCase() == "wth"){
                        const possibleMessages = ["Get used to it", "Worthless bots are on top!", "We're unforgetable" , "Potato mod bots but worse:", "Welcome to hell", "Worthless bots in town...", "MooMoo.io in Ohio be like:", "Imagine not hacking it's fun", "MooMoo: 2B2T of .io games"]
                        const result = getRandomItem(possibleMessages)
                        bot.sendPacket("ch", result)
                    }
                }
                if (type == "16") {
                    bot.xp = args[0];
                    bot.age = args[1];
                    let [xp, age] = args;
                    if (bot.age === 2) {
                        if (chosenBotItem == "sword") {
                            bot.sendPacket("6", 3)
                        }
                        if (chosenBotItem == "polearm") {
                            bot.sendPacket("5", 5)
                        }
                        if (chosenBotItem == "bat") {
                            bot.sendPacket("6", 6)
                        }
                        if (chosenBotItem == "dagger") {
                            bot.sendPacket("5", 7)
                        }
                        if (chosenBotItem == "stick") {
                            bot.sendPacket("5", 8)
                        }
                        if (chosenBotItem == "axe") {
                            bot.sendPacket("5", 1)
                        }
                    }
                    if (bot.age === 3) {
                        bot.sendPacket("6", 20)
                    }
                    if (bot.age === 4) {
                        bot.sendPacket("6", 31)
                    }
                    if (bot.age === 5) {
                        bot.sendPacket("6", 23)
                    }
                    if (bot.age === 6) {
                        bot.sendPacket("6", 11)
                    }
                }
                if (type == "h") {
                    let [sid, health] = args;
                    if (bot.sid === sid && health < 100 && health > 0) {
                        if (Combat == true) {
                            let myPlayer = MooMoo.myPlayer;
                            setTimeout(()=> {
                                bot.sendPacket("5", 0, false)
                                bot.sendPacket("c", 1, myPlayer.dir)
                                bot.sendPacket("c", 0, myPlayer.dir)
                                bot.sendPacket("5", 0, true)
                            }, 100)
                        } else if(bot.sid === sid && health > 0) {
                            bot.spawn();
                        }
                    }
                }
            })
        })
        bot.addEventListener(BOT_PACKET_EVENT, packetargs => {
            if (packetargs.packet === "11") bot.spawn();
        });
        const { region, index } = MooMoo.ServerManager.extractRegionAndIndex();
        bot[BOT_JOIN_REGION_INDEX]([region, index]);
        botManager.addBot(bot);
        // If the the botTarget variable is true, bots will move to player
        setInterval(() => {
            if (!bot.x || !bot.y) return;
            if (botTarget == false && attackPlayer == false) {
                let myPlayer = MooMoo.myPlayer
                const playerAngle = Math.atan2(botTargetY - bot.y, botTargetX - bot.x);
                let playerBotD = MooMoo.UTILS.getDistanceBetweenTwoPoints(botTargetX, botTargetY, bot.x, bot.y);
                if (playerBotD > 200) {
                    setTimeout(() => {
                        bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                        bot.sendPacket("2" , playerAngle)
                    }, 50)
                } else {
                    setTimeout(() => {
                        bot.sendPacket("33", null)
                    }, 50)
                }
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == false) {
                const playerAngle = Math.atan2(MooMoo.myPlayer.y - bot.y, MooMoo.myPlayer.x - bot.x);
                let playerBotD = MooMoo.UTILS.getDistanceBetweenTwoPoints(MooMoo.myPlayer.x, MooMoo.myPlayer.y, bot.x, bot.y);
                if (playerBotD > 200) {
                    setTimeout(() => {
                        bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                        bot.sendPacket("2" ,playerAngle)
                    }, 50)
                } else {
                    setTimeout(() => {
                        bot.sendPacket("33", null)
                    }, 50)
                }
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == true) {
                let nearestEnemy = activePlayerManager.getClosestEnemy();
                const playerAngle = Math.atan2(nearestEnemy.y - bot.y, nearestEnemy.x - bot.x)
                setTimeout(() => {
                    bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                    bot.sendPacket("2" ,playerAngle)
                }, 50)
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
        setInterval(() => {
            if (botTarget == true && attackPlayer == true) {
                let nearestEnemy = activePlayerManager.getClosestEnemy();
                const playerAngle = Math.atan2(nearestEnemy.y - bot.y, nearestEnemy.x - bot.x)
                setTimeout(() => {
                    bot.sendPacket(BOT_POSITION_UPDATE_PACKET, playerAngle);
                    bot.sendPacket("2" ,playerAngle)
                }, 50)
                if (Combat == true) {
                    setTimeout(() => {
                        bot.sendPacket("c", 1, playerAngle)
                    }, 100)
                }
                if (Combat == false) {
                    setTimeout(() => {
                        bot.sendPacket("c", 0, playerAngle)
                    }, 100)
                }
            }
        }, BOT_POSITION_UPDATE_INTERVAL);
    }
}

MooMoo.addEventListener(BOT_PACKET_EVENT, () => {
    if (MooMoo.myPlayer) {
        if (botManager._bots.size < BOT_COUNT) {
            Bot.generateBot(botManager);
            ConnectedBots += 1
        }
    }
});

CommandManager.registerCommand(COMMAND_NAME_SEND, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_SEND);
    for (let i = 1; i <= BOT_COUNT_TO_ADD; i++) {
        Bot.generateBot(botManager)
        ConnectedBots += 1
    }
});
CommandManager.registerCommand(COMMAND_NAME_POS, (Command, args) => {
    // Sets the arguments to the bot's target x and y coords.
    botTargetX = args[0];
    botTargetY = args[1];
    Command.reply("Bot_Target_Coords: " + (botTargetX) + ", " + (botTargetY))
})
CommandManager.registerCommand(COMMAND_NAME_CHOOSE, (Command, args) => {
    chosenBotItem = args[0]
    Command.reply("Bots_Choose: " + (chosenBotItem))
})
CommandManager.registerCommand(COMMAND_NAME_JOIN, (Command, args) => {
    let Name = args[0];
    TargetTeam = Name
    botManager._bots.forEach(bot => {
        bot.sendPacket("10", (Name))
    });
    Command.reply("Bots Joining: " + (Name))
})
CommandManager.registerCommand(COMMAND_NAME_LEAVE, (Command, args) => {
    botManager._bots.forEach(bot => {
        bot.sendPacket("9")
    });
    Command.reply("Bots leaving clan...")
})
CommandManager.registerCommand(COMMAND_NAME_TOGGLE, (Command, args) => {
    if (botTarget == true) {
        botTarget = false
    } else {
        botTarget = true
    }
    Command.reply("Follow_Player: " + (botTarget) )
})
CommandManager.registerCommand(COMMAND_NAME_PLAYER_COMBAT, (Command, args) => {
    if (Combat == true) {
        Combat = false
    } else{
        Combat = true
    }
    Command.reply("Bot_in_combat: " + (Combat) )
})
CommandManager.registerCommand(COMMAND_NAME_ATTACK, (Command, args) => {
    if (attackPlayer == true) {
        attackPlayer = false
    } else {
        attackPlayer = true
    }
    Command.reply("Attack_Near_Player: " + (attackPlayer) )
})
CommandManager.registerCommand(COMMAND_NAME_DISCONECT, (Command, args) => {
    Command.reply(COMMAND_RESPONSE_DISCONNECT);
    botManager._bots.forEach(bot => {
        bot.ws.close();
        ConnectedBots = 0
    });
});
const setStylesS = element2 => {
    const styles2 = {
        position: "absolute",
        top: "330px",
        left: "10px",
        color: "red",
        fontFamily: "serif",
        fontSize: "20px"
    };

    Object.entries(styles2).forEach(([key, value]) => {
        element2.style[key] = value;
    });
};

const GeneralStuff2 = () => {
    const gameInfoElement2 = document.createElement("div");
    setStylesS(gameInfoElement2);
    gameInfoElement2.id = "playerPosition2";
    document.body.appendChild(gameInfoElement2);
    const Updater = () => {
        document.getElementById("playerPosition2").innerText = `Commands:
        /send, /disconnect, /toggle, /attack, /leave
                /pos (X, Y), /join (ClanName)
        -------------------------------------------------------
        BotInfo:
        Bot Target Coords: ${(botTargetX)}, ${(botTargetY)} ~ '/pos'
        Follow_Player: ${(botTarget)} ~ '/toggle'
        Toggle_Combat: ${(Combat)} ~ '/combat'
        Team_to_join: ${(TargetTeam)} ~ '/join'
        Attack_Nearest_Enemy: ${(attackPlayer)} ~ 'ArrowDown'
        ConnectedBots: ${(ConnectedBots)}`
    };

    setInterval(Updater, 100);
};
// Code to listen for key press:

GeneralStuff2();
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 38 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "UpArrow" to toggle menu
        if (document.getElementById('playerPosition2').hidden == true) {
            document.getElementById('playerPosition2').hidden = false
        } else {
            document.getElementById('playerPosition2').hidden = true
        }
    }
    if (e.keyCode == 40 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "DownArrow" to toggle bot fight mode
        if (attackPlayer == true) {
            attackPlayer = false
            botManager._bots.forEach(bot => {
                bot.sendPacket("ch", "AAAHHHH RETREAT!")
            });
        } else {
            attackPlayer = true
            botManager._bots.forEach(bot => {
                bot.sendPacket("ch", "WE'RE GONNA GET YOU!")
            });
        }
        let myPlayer = MooMoo.myPlayer
        MooMoo.sendPacket("ch", "Attack_Near_Player: " + (attackPlayer) )
    }
});