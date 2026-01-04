// ==UserScript==
// @name          Profanity Filter for civitai
// @author        adisib /editor gavare
// @description   Simple filtering for profanity from website text. Not limited to static text, while avoiding performance impact. EDITED TO USE WITH CIVITAI AND R34.
// @license MIT
// @version       2024.06.07
// @include       https://rule34.*
// @include       https://civitai.com/*
// @grant         none
// @namespace https://greasyfork.org/users/80751
// @downloadURL https://update.greasyfork.org/scripts/499847/Profanity%20Filter%20for%20civitai.user.js
// @updateURL https://update.greasyfork.org/scripts/499847/Profanity%20Filter%20for%20civitai.meta.js
// ==/UserScript==

(function() {

    "use strict";


    // --- SETTINGS --------


    // The string that replaces offending words.
    const replaceString = "*bleep*";

    // If useCustomWords is true, then customWords is used as the word list and the default list will not be used. Otherwise, it uses a pre-compiled version of the default list for performance.
    // The words list does not have to include endings like plurals or "ing", as they will always be handled.
    // The default list is: ['fuck','shit','ass','damn','asshole','bullshit','bitch','piss','goddamn','crap','sh!t','bastard','dumbass','fag','motherfuck','nigger','cunt','douche','douchebag','jackass','mothafuck','pissoff','shitfull','fuk','fuckme','fucktard','fvck','fcuk','b!tch','phuq','phuk','phuck','fatass','faggot','dipshit','fagot','faggit','fagget','assfuck','buttfuck','asswipe','asskiss','assclown']
    // This should be ordered by most common first for performance, and must only contain alpha-numeric (unless you sanitize for regex)
        const useCustomWords = true;
    const customWords = ['aaron paul', 'aaron rodgers', 'adam ant', 'adam baldwin', 'adam driver', 'adam lambert', 'adam levine', 'adam sandler', 'adam savage', 'adam schiff', 'adele', 'adrien brody', 'al franken', 'al gore', 'al green', 'al pacino', 'al roker', 'al sharpton', 'alan alda', 'alan arkin', 'alan jackson', 'alanis morissette', 'albert brooks', 'alec baldwin', 'alex jones', 'alex rodriguez', 'alex trebek', 'alfre woodard', 'ali macgraw', 'alice cooper', 'alicia keys', 'alicia silverstone', 'alison krauss', 'alyssa milano', 'amanda bynes', 'amanda peet', 'amanda seyfried', 'amber heard', 'america ferrera', 'amy adams', 'amy grant', 'amy klobuchar', 'amy poehler', 'amy schumer', 'ana de armas', 'anderson cooper', 'andie macdowell', 'andre agassi', 'andrea bocelli', 'andrea mitchell', 'andrew cuomo', 'andrew garfield', 'andrew lloyd webber', 'andy cohen', 'andy garcia', 'andy samberg', 'angela bassett', 'angela lansbury', 'angela merkel', 'angelina jolie', 'anita baker', 'anjelica huston', 'ann coulter', 'ann curry', 'ann margret', 'anna faris', 'anna kendrick', 'anna paquin', 'anne hathaway', 'anne murray', 'anne rice', 'annette bening', 'annie lennox', 'anthony anderson', 'anthony d weiner', 'anthony hopkins', 'anthony kennedy', 'antonio banderas', 'ariana grande', 'arlo guthrie', 'arnold schwarzenegger', 'arsenio hall', 'art garfunkel', 'ashanti', 'ashlee simpson', 'ashley judd', 'ashton kutcher', 'axl rose', 'barack obama', 'barbara eden', 'barbara mandrell', 'barbara walters', 'barbra streisand', 'barry bonds', 'barry manilow', 'barry sanders', 'beau bridges', 'belinda carlisle', 'ben affleck', 'ben carson', 'ben kingsley', 'ben roethlisberger', 'ben shapiro', 'ben stein', 'ben stiller', 'benedict cumberbatch', 'benicio del toro', 'benjamin bratt', 'bernadette peters', 'bernie sanders', 'beto o rourke', 'bette midler', 'betty white', 'beverly d angelo', 'beyoncé', 'bill belichick', 'bill clinton', 'bill cosby', 'bill de blasio', 'bill engvall', 'bill gates', 'bill hader', 'bill maher', 'bill murray', 'bill nye', 'bill o reilly', 'bill pullman', 'bill russell', 'bill skarsgård', 'billie eilish', 'billie jean king', 'billy bob thornton', 'billy crystal', 'billy dee williams', 'billy idol', 'billy joel', 'billy ocean', 'billy ray cyrus', 'billy zane', 'bjork', 'bjorn borg', 'blake lively', 'blake shelton', 'bo jackson', 'bob barker', 'bob costas', 'bob dole', 'bob dylan', 'bob eubanks', 'bob newhart', 'bob saget', 'bob schieffer', 'bob seger', 'bob uecker', 'bobby flay', 'bobby knight', 'bonnie hunt', 'bonnie raitt', 'bonnie tyler', 'boris johnson', 'boy george', 'boz scaggs', 'brad paisley', 'brad pitt', 'bradley cooper', 'brendan fraser', 'bret michaels', 'brett favre', 'brett kavanaugh', 'brian dennehy', 'brian williams', 'brian wilson', 'brie larson', 'brigitte bardot', 'brigitte nielsen', 'bristol palin', 'brit hume', 'britney spears', 'brooke shields', 'bruce dern', 'bruce springsteen', 'bruce willis', 'bruno mars', 'bryan adams', 'bryan cranston', 'bryant gumbel', 'burt bacharach', 'caitlyn jenner', 'cal ripken', 'cam newton', 'cameron diaz', 'candice bergen', 'carl lewis', 'carl reiner', 'carlos santana', 'carlos santana', 'carly rae jepsen', 'carly simon', 'carmen electra', 'carol burnett', 'carole king', 'caroline kennedy', 'carrie underwood', 'carrot top', 'carson daly', 'casey affleck', 'cat stevens', 'cate blanchett', 'catherine middleton', 'catherine o hara', 'catherine zeta jones', 'cedric the entertainer', 'cee lo green', 'celine dion', 'cesar millan', 'chadwick boseman', 'chaka khan', 'chance the rapper', 'channing tatum', 'charles barkley', 'charles schumer', 'charley pride', 'charlie rose', 'charlie sheen', 'charlize theron', 'cheech marin', 'chelsea clinton', 'chelsea handler', 'chelsea manning', 'cheryl tiegs', 'chevy chase', 'chris brown', 'chris christie', 'chris daughtry', 'chris elliott', 'chris evans', 'chris evert', 'chris hansen', 'chris hemsworth', 'chris isaak', 'chris matthews', 'chris noth', 'chris o donnell', 'chris pine', 'chris pratt', 'chris rock', 'chris tucker', 'chris wallace', 'christian bale', 'christian slater', 'christiane amanpour', 'christie brinkley', 'christina aguilera', 'christina applegate', 'christina ricci', 'christopher cross', 'christopher cuomo', 'christopher lloyd', 'christopher meloni', 'christopher plummer', 'christopher walken', 'chubby checker', 'chuck norris', 'chuck woolery', 'ciara', 'cicely tyson', 'cindy crawford', 'claire danes', 'clarence thomas', 'clay aiken', 'clint black', 'clint eastwood', 'clive owen', 'cloris leachman', 'cokie roberts', 'colin farrell', 'colin firth', 'colin kaepernick', 'colin powell', 'conan o brien', 'condoleezza rice', 'connie chung', 'connie francis', 'conor mcgregor', 'cory booker', 'courteney cox', 'courtney love', 'craig ferguson', 'craig t nelson', 'criss angel', 'cristiano ronaldo', 'crystal gayle', 'cuba gooding', 'cybill shepherd', 'cyndi lauper', 'cynthia nixon', 'dabney coleman', 'daisy ridley', 'dakota fanning', 'dakota johnson', 'dalai lama', 'dale earnhardt', 'damon wayans', 'damon wayans', 'dan aykroyd', 'dan marino', 'dan quayle', 'dan rather', 'dana carvey', 'dane cook', 'danica patrick', 'daniel craig', 'daniel dae kim', 'daniel day lewis', 'daniel radcliffe', 'danielle steel', 'danny bonaduce', 'danny devito', 'danny glover', 'danny trejo', 'darius rucker', 'daryl hannah', 'dave chappelle', 'dave grohl', 'dave ramsey', 'david attenborough', 'david beckham', 'david crosby', 'david duchovny', 'david h koch', 'david hasselhoff', 'david hyde pierce', 'david lee roth', 'david letterman', 'david ortiz', 'david petraeus', 'david schwimmer', 'david spade', 'dean cain', 'dean koontz', 'dean mcdermott', 'debbie gibson', 'debbie harry', 'debra messing', 'debra winger', 'dee snider', 'deion sanders', 'delta burke', 'demi lovato', 'demi moore', 'denise richards', 'dennis miller', 'dennis quaid', 'dennis rodman', 'denzel washington', 'derek jeter', 'diana ross', 'diane keaton', 'diane lane', 'diane sawyer', 'dianne feinstein', 'dick butkus', 'dick cavett', 'dick cheney', 'dick van dyke', 'dionne warwick', 'dj khaled', 'dolly parton', 'dolph lundgren', 'don cheadle', 'don henley', 'don imus', 'don johnson', 'don lemon', 'don mclean', 'donald rumsfeld', 'donald sutherland', 'donald trump', 'donald trump', 'donnie wahlberg', 'donny osmond', 'doris day', 'dr dre', 'drake', 'drew barrymore', 'drew brees', 'drew carey', 'drew scott', 'duchess of sussex', 'duke of sussex', 'dustin hoffman', 'dwayne johnson', 'dwight yoakam', 'dwyane wade', 'dylan mcdermott', 'ed asner', 'ed harris', 'ed helms', 'ed o neill', 'ed sheeran', 'eddie murphy', 'eddie van halen', 'edward james olmos', 'edward norton', 'eli manning', 'elijah cummings', 'elijah wood', 'eliot spitzer', 'elisabeth hasselbeck', 'elisabeth moss', 'elisabeth shue', 'elizabeth banks', 'elizabeth cheney', 'elizabeth dole', 'elizabeth hurley', 'elizabeth olsen', 'elizabeth warren', 'elle fanning', 'elle macpherson', 'ellen burstyn', 'ellen degeneres', 'ellen page', 'elliot page', 'elliott gould', 'elon musk', 'elton john', 'elvis costello', 'emeril lagasse', 'emilio estevez', 'emily blunt', 'emily deschanel', 'emily watson', 'eminem', 'emma roberts', 'emma stone', 'emma thompson', 'emma watson', 'emmanuel macron', 'emmitt smith', 'emmylou harris', 'engelbert humperdinck', 'enrique iglesias', 'eric clapton', 'eric holder', 'eric roberts', 'erik estrada', 'ethan hawke', 'eugene levy', 'eva longoria', 'eva marie saint', 'eva mendes', 'evan rachel wood', 'evander holyfield', 'ewan mcgregor', 'faith hill', 'faye dunaway', 'felicity huffman', 'fergie', 'fiona apple', 'flavor flav', 'floyd mayweather', 'forest whitaker', 'fran drescher', 'fran tarkenton', 'frances mcdormand', 'francis ford coppola', 'frankie avalon', 'fred savage', 'g gordon liddy', 'gabriel iglesias', 'gabrielle giffords', 'gabrielle union', 'gal gadot', 'garth brooks', 'gary busey', 'gary oldman', 'gary sinise', 'gavin newsom', 'gayle king', 'geena davis', 'gena rowlands', 'gene hackman', 'gene simmons', 'george clinton', 'george clooney', 'george foreman', 'george lopez', 'george lucas', 'george soros', 'george stephanopoulos', 'george strait', 'george takei', 'george w bush', 'geraldo rivera', 'gerard butler', 'gérard depardieu', 'gillian anderson', 'gina rodriguez', 'gisele bündchen', 'glenn beck', 'glenn close', 'gloria estefan', 'gloria gaynor', 'goldie hawn', 'gordon lightfoot', 'gordon ramsay', 'greg abbott', 'greg kinnear', 'greg mathis', 'greta van susteren', 'guy fieri', 'guy ritchie', 'gwen stefani', 'gwyneth paltrow', 'hakeem jeffries', 'hal holbrook', 'haley joel osment', 'halle berry', 'hank aaron', 'hank williams', 'harrison ford', 'harry belafonte', 'harry connick', 'harry reid', 'harvey keitel', 'hayden christensen', 'hayden panettiere', 'heather locklear', 'hector elizondo', 'heidi fleiss', 'heidi klum', 'helen hunt', 'helen mirren', 'helena bonham carter', 'henry cavill', 'henry kissinger', 'henry winkler', 'herman cain', 'herschel walker', 'hilary duff', 'hilary swank', 'hillary clinton', 'hoda kotb', 'holly hunter', 'howard stern', 'howie long', 'howie mandel', 'huey lewis', 'hugh grant', 'hugh jackman', 'hugh laurie', 'hulk hogan', 'ian mckellen', 'ice t', 'idris elba', 'iggy azalea', 'iggy pop', 'ilhan omar', 'isaiah washington', 'ivanka trump', 'j k rowling', 'j k simmons', 'ja rule', 'jack black', 'jack hanna', 'jack nicholson', 'jack nicklaus', 'jack osbourne', 'jackie chan', 'jackson browne', 'jacqueline bisset', 'jada pinkett smith', 'jaden smith', 'jake gyllenhaal', 'james brolin', 'james caan', 'james cameron', 'james caviezel', 'james comey', 'james corden', 'james cromwell', 'james earl jones', 'james franco', 'james marsden', 'james patterson', 'james spader', 'james taylor', 'james woods', 'jamie foxx', 'jamie lee curtis', 'jamie oliver', 'jane curtin', 'jane fonda', 'jane goodall', 'jane lynch', 'jane pauley', 'jane seymour', 'janeane garofalo', 'janet jackson', 'janet yellen', 'jared kushner', 'jared leto', 'jason aldean', 'jason alexander', 'jason bateman', 'jason momoa', 'jason segel', 'jason statham', 'jason sudeikis', 'jay leno', 'jay rockefeller', 'jay z', 'jean claude van damme', 'jeanine pirro', 'jeb bush', 'jeff beck', 'jeff bezos', 'jeff bridges', 'jeff daniels', 'jeff dunham', 'jeff foxworthy', 'jeff goldblum', 'jeff gordon', 'jeff sessions', 'jenna bush hager', 'jenna elfman', 'jenna ortega', 'jennifer aniston', 'jennifer connelly', 'jennifer coolidge', 'jennifer garner', 'jennifer grey', 'jennifer hudson', 'jennifer jason leigh', 'jennifer lawrence', 'jennifer lopez', 'jennifer love hewitt', 'jenny mccarthy', 'jeremy irons', 'jeremy renner', 'jerry lee lewis', 'jerry o connell', 'jerry rice', 'jerry seinfeld', 'jerry springer', 'jerry stiller', 'jesse eisenberg', 'jesse jackson', 'jesse james', 'jesse watters', 'jessica alba', 'jessica biel', 'jessica chastain', 'jessica lange', 'jessica simpson', 'jet li', 'jill biden', 'jillian michaels', 'jim bakker', 'jim belushi', 'jim bob duggar', 'jim brown', 'jim carrey', 'jim parsons', 'jimmy buffett', 'jimmy carter', 'jimmy fallon', 'jimmy kimmel', 'jimmy page', 'jimmy smits', 'jimmy swaggart', 'joan baez', 'joan cusack', 'joan jett', 'joan lunden', 'joanne woodward', 'joaquin phoenix', 'jodie foster', 'joe biden', 'joe brown', 'joe jonas', 'joe lieberman', 'joe manchin', 'joe mantegna', 'joe montana', 'joe namath', 'joe pesci', 'joe rogan', 'joe walsh', 'joel mchale', 'joel osteen', 'joey fatone', 'john amos', 'john astin', 'john bolton', 'john c reilly', 'john carpenter', 'john cena', 'john cleese', 'john cusack', 'john edwards', 'john elway', 'john fogerty', 'john goodman', 'john grisham', 'john kerry', 'john krasinski', 'john legend', 'john leguizamo', 'john lithgow', 'john madden', 'john malkovich', 'john mayer', 'john mcenroe', 'john mellencamp', 'john oliver', 'john quiñones', 'john ratzenberger', 'john roberts', 'john stamos', 'john tesh', 'john travolta', 'john turturro', 'johnny depp', 'johnny knoxville', 'johnny mathis', 'jon bon jovi', 'jon favreau', 'jon gosselin', 'jon hamm', 'jon lovitz', 'jon stewart', 'jon voight', 'jonah hill', 'joni mitchell', 'jordan peele', 'jordin sparks', 'josé canseco', 'joseph gordon levitt', 'joseph p kennedy', 'josh brolin', 'josh duhamel', 'josh groban', 'josh hartnett', 'joy behar', 'judd hirsch', 'jude law', 'judi dench', 'judith light', 'judy sheindlin', 'julia louis dreyfus', 'julia roberts', 'julia stiles', 'julian castro', 'julianna margulies', 'julianne hough', 'julianne moore', 'julie andrews', 'julie chen', 'julie christie', 'juliette lewis', 'julio césar chávez', 'julio iglesias', 'julius erving', 'justin bieber', 'justin timberlake', 'justin trudeau', 'k d lang', 'kaley cuoco', 'kamala harris', 'kanye west', 'kareem abdul jabbar', 'karl malone', 'karl rove', 'kate beckinsale', 'kate bosworth', 'kate gosselin', 'kate hudson', 'kate jackson', 'kate middleton', 'kate upton', 'kate winslet', 'katey sagal', 'katherine heigl', 'kathie lee gifford', 'kathleen turner', 'kathy bates', 'kathy griffin', 'kathy ireland', 'katie couric', 'katie holmes', 'katy perry', 'keanu reeves', 'keegan michael key', 'keenen ivory wayans', 'keira knightley', 'keith olbermann', 'keith richards', 'keith urban', 'keke palmer', 'kelly clarkson', 'kelly osbourne', 'kelly ripa', 'kellyanne conway', 'kelsey grammer', 'ken griffey', 'ken starr', 'kendall jenner', 'kendrick lamar', 'kenny chesney', 'kenny g', 'kenny loggins', 'keri russell', 'kerry washington', 'kesha', 'kevin bacon', 'kevin costner', 'kevin durant', 'kevin hart', 'kevin james', 'kevin kline', 'kevin mccarthy', 'kevin smith', 'kevin spacey', 'khloe kardashian', 'kid rock', 'kiefer sutherland', 'kim basinger', 'kim cattrall', 'kim kardashian', 'kim novak', 'king charles', 'kirk cameron', 'kirk douglas', 'kirsten dunst', 'kirsten gillibrand', 'kirstie alley', 'kobe bryant', 'kourtney kardashian', 'kris jenner', 'kris kristofferson', 'kristen bell', 'kristen stewart', 'kristen wiig', 'kristi yamaguchi', 'kurt russell', 'kylie jenner', 'kyra sedgwick', 'lady gaga', 'lamar odom', 'lana del rey', 'lance armstrong', 'larry bird', 'larry david', 'larry holmes', 'larry king', 'larry the cable guy', 'laura bush', 'laura dern', 'laura ingraham', 'lauren graham', 'lauren hutton', 'laurence fishburne', 'laurie metcalf', 'lauryn hill', 'lea thompson', 'leah remini', 'leann rimes', 'lebron james', 'lee ann womack', 'leeza gibbons', 'lena dunham', 'lenny kravitz', 'leonardo dicaprio', 'lester holt', 'levar burton', 'liam hemsworth', 'liam neeson', 'liev schreiber', 'lil  jon', 'lil  kim', 'lil wayne', 'lily tomlin', 'linda hamilton', 'linda ronstadt', 'lindsay lohan', 'lindsey graham', 'lionel messi', 'lionel richie', 'lisa kudrow', 'lisa ling', 'lisa marie presley', 'little richard', 'liv tyler', 'liza minnelli', 'll cool j', 'loni anderson', 'lorde', 'loretta lynch', 'loretta lynn', 'lou diamond phillips', 'lou dobbs', 'lou ferrigno', 'louie anderson', 'louis ck', 'louis gossett', 'lucy liu', 'ludacris', 'luke bryan', 'luke perry', 'luke wilson', 'lyle lovett', 'lynda carter', 'm night shyamalan', 'macaulay culkin', 'machine gun kelly', 'macy gray', 'madeleine albright', 'maggie smith', 'magic johnson', 'malcolm jamal warner', 'malcolm mcdowell', 'mandy moore', 'manny pacquiáo', 'marc anthony', 'marco rubio', 'margot robbie', 'maria sharapova', 'mariah carey', 'marie osmond', 'marilyn manson', 'mario lópez', 'marisa tomei', 'mariska hargitay', 'mark cuban', 'mark hamill', 'mark harmon', 'mark mcgwire', 'mark ruffalo', 'mark wahlberg', 'mark zuckerberg', 'marlo thomas', 'marlon wayans', 'martha stewart', 'martin lawrence', 'martin scorsese', 'martin sheen', 'martin short', 'martina mcbride', 'martina navratilova', 'mary chapin carpenter', 'mary higgins clark', 'mary j blige', 'mary kate olsen', 'mary louise parker', 'mary steenburgen', 'matt damon', 'matt dillon', 'matt lauer', 'matt leblanc', 'matthew broderick', 'matthew mcconaughey', 'matthew perry', 'maury povich', 'maxine waters', 'maya rudolph', 'mayim bialik', 'meg ryan', 'megan fox', 'megan rapinoe', 'meghan markle', 'meghan mccain', 'meghan trainor', 'megyn kelly', 'mehmet oz', 'mel brooks', 'mel gibson', 'melania trump', 'melanie griffith', 'melissa etheridge', 'melissa joan hart', 'melissa mccarthy', 'meredith vieira', 'meryl streep', 'mia farrow', 'michael b jordan', 'michael bloomberg', 'michael bolton', 'michael bublé', 'michael c hall', 'michael caine', 'michael cera', 'michael chiklis', 'michael douglas', 'michael dukakis', 'michael flynn', 'michael irvin', 'michael j fox', 'michael jordan', 'michael keaton', 'michael moore', 'michael peña', 'michael phelps', 'michael sheen', 'michael strahan', 'michael vick', 'michelle kwan', 'michelle obama', 'michelle pfeiffer', 'michelle rodriguez', 'michelle williams', 'michelle yeoh', 'mick jagger', 'mickey rourke', 'mike ditka', 'mike epps', 'mike huckabee', 'mike myers', 'mike pence', 'mike pompeo', 'mike rowe', 'mike sorrentino', 'mike tyson', 'mila kunis', 'miley cyrus', 'milla jovovich', 'millie bobby brown', 'mindy kaling', 'minnie driver', 'mira sorvino', 'miranda lambert', 'missy elliott', 'mitch mcconnell', 'mitt romney', 'molly ringwald', 'molly shannon', 'montel williams', 'morgan fairchild', 'morgan freeman', 'mr t', 'nancy grace', 'nancy pelosi', 'nancy sinatra', 'naomi campbell', 'naomi judd', 'naomi watts', 'natalie portman', 'nathan lane', 'ned beatty', 'neil degrasse tyson', 'neil diamond', 'neil gorsuch', 'neil patrick harris', 'neil sedaka', 'neil young', 'nelly furtado', 'nelly', 'neve campbell', 'newt gingrich', 'nick cannon', 'nick jonas', 'nick lachey', 'nick nolte', 'nicki minaj', 'nicolas cage', 'nicole kidman', 'nicole polizzi', 'nicole richie', 'nikki haley', 'nolan ryan', 'nora roberts', 'norah jones', 'norah o donnell', 'octavia spencer', 'odell beckham', 'oliver north', 'oliver stone', 'olivia de havilland', 'olivia munn', 'olivia newton john', 'olivia wilde', 'olympia dukakis', 'omar epps', 'oprah winfrey', 'orlando bloom', 'oscar de la hoya', 'owen wilson', 'ozzy osbourne', 'pamela anderson', 'paris hilton', 'pat benatar', 'pat buchanan', 'pat roberts', 'pat robertson', 'pat sajak', 'patricia arquette', 'patrick dempsey', 'patrick duffy', 'patrick ewing', 'patrick kennedy', 'patrick mahomes', 'patrick stewart', 'patti labelle', 'patton oswalt', 'paul anka', 'paul giamatti', 'paul hogan', 'paul mccarthy', 'paul mccartney', 'paul reubens', 'paul rudd', 'paul ryan', 'paul simon', 'paula abdul', 'paula deen', 'paula zahn', 'penelope cruz', 'perez hilton', 'pete rose', 'pete townshend', 'peter dinklage', 'peter fonda', 'peter frampton', 'peter gabriel', 'peyton manning', 'pharrell williams', 'phil donahue', 'phil mcgraw', 'phil mickelson', 'phil robertson', 'phylicia rashad', 'pierce brosnan', 'piers morgan', 'plácido domingo', 'pope benedict', 'pope francis', 'portia de rossi', 'post malone', 'prince harry', 'prince of wales', 'princess of wales', 'priyanka chopra', 'queen elizabeth', 'queen latifah', 'quincy jones', 'r kelly', 'rachael ray', 'rachel maddow', 'rachel mcadams', 'rachel weisz', 'rami malek', 'rand paul', 'randy jackson', 'randy newman', 'randy quaid', 'randy travis', 'raquel welch', 'rashida jones', 'rashida tlaib', 'raven symoné', 'ray liotta', 'ray romano', 'ray stevens', 'reba mcentire', 'rebel wilson', 'reese witherspoon', 'reggie bush', 'reggie jackson', 'reggie miller', 'regina hall', 'regina king', 'regis philbin', 'rene russo', 'renee zellweger', 'rhea perlman', 'ric flair', 'richard belzer', 'richard branson', 'richard dean anderson', 'richard dreyfuss', 'richard gere', 'richard petty', 'rick moranis', 'rick perry', 'rick santorum', 'rick scott', 'rick springfield', 'ricki lake', 'ricky gervais', 'ricky martin', 'ricky skaggs', 'rihanna', 'ringo starr', 'rob gronkowski', 'rob lowe', 'rob reiner', 'rob schneider', 'rob zombie', 'robert de niro', 'robert downey', 'robert duvall', 'robert patrick', 'robert pattinson', 'robert plant', 'robert redford', 'robert wagner', 'roberta flack', 'robin roberts', 'robin thicke', 'robin wright', 'rod stewart', 'roger clemens', 'roger federer', 'roger staubach', 'roman polański', 'ron desantis', 'ron howard', 'ron paul', 'ron perlman', 'ron reagan', 'ronda rousey', 'ronnie milsap', 'rosalynn carter', 'rosanne cash', 'rosario dawson', 'rosie o donnell', 'rosie perez', 'rowan atkinson', 'rudy giuliani', 'rupaul', 'rupert grint', 'rupert murdoch', 'rush limbaugh', 'russell brand', 'russell crowe', 'ruth bader ginsburg', 'ryan gosling', 'ryan reynolds', 'ryan seacrest', 'sacha baron cohen', 'sally field', 'sally jessy raphaël', 'sally struthers', 'salma hayek', 'sam donaldson', 'sam elliott', 'sam neill', 'sam smith', 'sam waterston', 'sammy hagar', 'sammy sosa', 'samuel alito', 'samuel l jackson', 'sandra bullock', 'sandra day o connor', 'sandra oh', 'sandy koufax', 'sanjay gupta', 'sara gilbert', 'sarah huckabee sanders', 'sarah jessica parker', 'sarah mclachlan', 'sarah michelle gellar', 'sarah palin', 'sarah paulson', 'sarah silverman', 'savannah guthrie', 'scarlett johansson', 'scott baio', 'scott bakula', 'scott eastwood', 'scott hamilton', 'scottie pippen', 'sean astin', 'sean connery', 'sean hannity', 'sean penn', 'sean spicer', 'sebastian bach', 'selena gomez', 'selma blair', 'serena williams', 'seth green', 'seth macfarlane', 'seth meyers', 'seth rogen', 'shakira', 'shania twain', 'shaquille oneal', 'sharon osbourne', 'sharon stone', 'shaun white', 'shawn mendes', 'shawn wayans', 'sheena easton', 'shelley long', 'shemar moore', 'shepard smith', 'sheryl crow', 'shia labeouf', 'shirley jones', 'shirley maclaine', 'sidney poitier', 'sigourney weaver', 'simon cowell', 'sinbad', 'sinead o connor', 'sissy spacek', 'sofia coppola', 'sofía vergara', 'sonia sotomayor', 'sophia loren', 'sophie turner', 'soulja boy', 'spike lee', 'stanley tucci', 'star jones', 'stefanie graf', 'stephen bannon', 'stephen colbert', 'stephen curry', 'stephen king', 'steve austin', 'steve buscemi', 'steve carell', 'steve forbes', 'steve martin', 'steve perry', 'steve wilkos', 'steve winwood', 'steven seagal', 'steven spielberg', 'steven tyler', 'stevie wonder', 'stockard channing', 'sugar ray leonard', 'susan boyle', 'susan collins', 'susan lucci', 'susan rice', 'susan sarandon', 'suzanne somers', 'suze orman', 'sylvester stallone', 't pain', 'tanya tucker', 'tara reid', 'tatum oneal', 'taye diggs', 'taylor lautner', 'taylor swift', 'téa leoni', 'ted cruz', 'ted danson', 'ted koppel', 'ted nugent', 'teri hatcher', 'terrell owens', 'terrence howard', 'terry bradshaw', 'terry crews', 'the weeknd', 'tiffany haddish', 'tiger woods', 'tim allen', 'tim conway', 'tim curry', 'tim daly', 'tim mcgraw', 'tim robbins', 'tim roth', 'tim scott', 'tim tebow', 'timbaland', 'timothy dalton', 'timothy hutton', 'tina fey', 'tipper gore', 'tobey maguire', 'toby keith', 'tom arnold', 'tom berenger', 'tom bergeron', 'tom brady', 'tom brokaw', 'tom cruise', 'tom hanks', 'tom hardy', 'tom hiddleston', 'tom holland', 'tom jones', 'tom selleck', 'tom sizemore', 'tom skerritt', 'tommy chong', 'tommy lee jones', 'toni braxton', 'tony bennett', 'tony blair', 'tony danza', 'tony orlando', 'tony robbins', 'tony romo', 'tony shalhoub', 'tonya harding', 'tori spelling', 'trace adkins', 'tracey ullman', 'tracy morgan', 'trevor noah', 'trisha yearwood', 'troy aikman', 'tucker carlson', 'tulsi gabbard', 'ty pennington', 'tyler perry', 'tyra banks', 'uma thurman', 'usain bolt', 'usher', 'val kilmer', 'valerie bertinelli', 'valerie harper', 'vanessa hudgens', 'vanessa l williams', 'vanessa redgrave', 'vanilla ice', 'vanna white', 'venus williams', 'viggo mortensen', 'vin diesel', 'vince gill', 'vince mcmahon', 'vince vaughn', 'vincent d onofrio', 'viola davis', 'vivica a fox', 'vladimir putin', 'walter mondale', 'wanda sykes', 'warren beatty', 'warren buffett', 'wayne brady', 'wayne gretzky', 'wayne knight', 'weird al yankovic', 'wendy williams', 'wesley snipes', 'whoopi goldberg', 'wilford brimley', 'will arnett', 'will ferrell', 'will smith', 'willard scott', 'willem dafoe', 'william h macy', 'william hurt', 'william shatner', 'willie mays', 'willie nelson', 'winona ryder', 'wolf blitzer', 'wolfgang puck', 'woody allen', 'woody harrelson', 'wynonna judd', 'xi jinping', 'yo yo ma', 'yoko ono', 'yusuf islam', 'zac efron', 'zach braff', 'zach galifianakis', 'ziggy marley', 'zoe kravitz', 'zoe saldana', 'zooey deschanel',
                         'cave nigger', 'africoon', 'africoons', 'akata', 'akatas', 'beaner', 'beaners', 'beastial', 'beastiality', 'bestial', 'bestiality', 'browntown', 'chigger', 'chink', 'chinks', 'coon', 'coonass', 'coonasses', 'coons', 'darkie', 'darkies', 'daughter', 'dike', 'dog-fucker', 'dune coon', 'dune coons', 'dyke', 'gas chamber', 'gas chambers', 'gook', 'gooks', 'guinne', 'honkey', 'incest', 'incestuous', 'jail bait', 'jail-bait', 'jail.bait', 'jail_bait', 'jailbait', 'jap', 'japs', 'jejune', 'jew', 'jews', 'jigaboo', 'juvenile', 'kike', 'kikes', 'kkk', 'kraut', 'loli', 'loli-con', 'loli.con', 'loli_con', 'lolicon', 'lolis', 'lolita', 'mick', 'midget', 'midgets', 'mongoloid', 'n1g', 'n1gga', 'n1gger', 'nazi', 'nazis', 'necro', 'necrophilia', 'negro', 'negros', 'neonazi', 'neonazis', 'nig', 'niga', 'nigas', 'nigg3r', 'nigg4h', 'nigga', 'niggah', 'niggar', 'niggas', 'niggaz', 'nigger', 'niggers', 'niglet', 'niglets', 'nignog', 'nignogs', 'nigs', 'nonconsentual', 'paedophile', 'paki', 'pakis', 'pedobear', 'pedophile', 'porch monkey', 'porch monkeys', 'puberty', 'puerile', 'rag-head', 'raghead', 'ragheads', 'rape', 'raped', 'raping', 'rapist', 'rapists', 'retard', 'retarded', 'retards', 'rice nigger', 'rigor mortis', 'scat', 'scrawny', 'shit', 'shitter', 'shitting', 'shota', 'shota-con', 'shota.con', 'shota_con', 'shotacon', 'spic', 'spics', 'spook', 'spooks', 'statutory rape', 'swastika', 'terrorist', 'third reich', 'towel head', 'towel heads', 'towelhead', 'towelheads', 'turk', 'turks', 'wetback', 'wetbacks', 'wigger', 'wiggers', 'wop', 'yigger',
                         'cave nigger', 'africoon', 'africoons', 'akata', 'akatas', 'beaner', 'beaners', 'beastial', 'beastiality', 'bestial', 'bestiality', 'browntown', 'chigger', 'chink', 'chinks', 'coon', 'coonass', 'coonasses', 'coons', 'dike', 'dog-fucker', 'dune coon', 'dune coons', 'dyke', 'gas chamber', 'gas chambers', 'gook', 'gooks', 'guinne', 'honkey', 'incest', 'incestuous', 'jail bait', 'jail-bait', 'jail.bait', 'jail_bait', 'jailbait', 'jap', 'japs', 'jejune', 'jew', 'jews', 'jigaboo', 'kike', 'kikes', 'kkk', 'loli', 'lolii', 'loli-con', 'loli.con', 'loli_con', 'lolicon', 'lolis', 'lolita', 'mick', 'mongoloid', 'n1g', 'n1gga', 'n1gger', 'nazi', 'nazis', 'necro', 'necrophilia', 'negro', 'negros', 'neonazi', 'neonazis', 'nig', 'niga', 'nigas', 'nigg3r', 'nigg4h', 'nigga', 'niggah', 'niggar', 'niggas', 'niggaz', 'nigger', 'niggers', 'niglet', 'niglets', 'nignog', 'nignogs', 'nigs', 'paki', 'pakis', 'pedobear', 'pedophile', 'porch monkey', 'porch monkeys', 'puberty', 'pubescent', 'puerile', 'rag-head', 'raghead', 'ragheads', 'retard', 'retarded', 'retards', 'rice nigger', 'scat', 'scrawny', 'shit', 'shitter', 'shitting', 'shota', 'shota-con', 'shota.con', 'shota_con', 'shotacon', 'spic', 'spics', 'spook', 'spooks', 'swastika', 'terrorist', 'third reich', 'towel head', 'towel heads', 'towelhead', 'towelheads', 'turk', 'turks', 'wetback', 'wetbacks', 'wigger', 'wiggers', 'wop', 'yigger', '👶', '👼', '🤱', '👩‍🍼', '👨‍🍼', '🧑‍🍼', '🚼', '🍼', '🧒',
                         'young','younger', 'youngest', 'adolescence', 'jnr', 'jr', 'youth', 'youthful', 'yng', 'childish', 'neotenous', 'immatured?', 'infantile', 'scho+l', 'lit+le', 'lil', 'small', 'tiny', 'bairn', 'nipper', 'babyish', 'babylike', 'childlike', 'teenie', 'teeny', 'not mature', 'not old', 'disney', 'loli', 'shota', 'babe',
                         'young', 'younger', 'youngest', 'adolescence', 'jnr', 'jr', 'youth', 'youthful', 'yng', 'childish', 'neotenous', 'immatured?', 'infantile', 'scho+l', 'lit+le', 'lil', 'small', 'tiny', 'bairn', 'nipper', 'babyish', 'babylike', 'childlike', 'teenie', 'teeny', 'not mature', 'not old', 'disney', 'loli', 'shota', 'babe', 'sister', 'daughter', 'brother', 'son', 'young looking', 'extremely young', 'mini girl', 'mini boy', 'kindergartens*', 'pubescent', 'pre pubescent', 'to*ddle?r', 'under ager', 'under age', 'under the legal age', 'under aged', 'under developed', 'under grown', 'un grown', 'very young', '\\w*kg[0-9]+\\w*', '\\w*infant\\w*', '\\w*kindergartener\\w*', '\\w*kindergarten\\w*', '\\w*preschooler\\w*', '\\w*preschool\\w*', 'pre k', 'elementary school?', 'elementary aged?', 'primary school?', 'middle school?', 'middle schooler', 'high school?', 'high schooler', '\\d+(st|nd|rd|th)? grade', 'whippersnapper', '\\w*newborn\\w*', '\\w*tike\\w*', '\\w*tyke\\w*', '\\w*sprog\\w*', '\\w*minor\\w*', '\\w*toddle\\w*', '\\w*tee+n\\w*', 'tean\\w*', 'twe[e|a]n\\w*', '\\w*pre te[e|a]+n\\w*', '\\w*adolescent\\w*', 'youth', 'stripling', '\\w*youngster\\w*', '\\w*youngling\\w*', '\\w*kid', 'kid\\w*', '\\w*kiddo\\w*', '\\w*ba+b+ y\\w*', '\\w*ba+bies\\w*', '\\w*t[i|o]d*le*r\\w*', '\\w*chi*ld\\w*', '\\w*chi*ldren\\w*', '\\w*juvenile', '\\w*kiddy\\w*', '\\w*kiddie\\w*', '\\w*tot', '\\w*urchin\\w*', '\\w*nin[o|a]\\w*', '\\w*l+oli+e?', 'l+oli[c|k]on', '1 shota', 'one shota', 'shota', 'shota[c|k]on', 'プレティーン', 'ロリ',
    ];
    // Display performance and debugging information to the console.
    const DEBUG = false;


    // --------------------


    let wordString = useCustomWords ? "\\b(?:" + customWords.join("|") + ")[tgkp]??(?=(?:ing?(?:ess)??|ed|i??er|a)??(?:e??[syz])??\\b)" : "\\b(?:(?:f(?:u(?:ck(?:me|tard)??|k)|a(?:g(?:(?:g[eio]|o)t)??|tass)|(?:cu|vc)k)|b(?:u(?:llshit|ttfuck)|[!i]tch|astard)|ass(?:(?:hol|wip)e|clown|fuck|kiss)??|d(?:amn|umbass|ouche(?:bag)??|ipshit)|p(?:hu(?:c?k|q)|iss(?:off)??)|sh(?:it(?:full)??|!t)|moth(?:er|a)fuck|c(?:rap|unt)|goddamn|jackass|nigg))[tgkp]??(?=(?:ing?(?:ess)??|ed|i??er|a)??(?:e??[syz])??\\b)";
    const wordsFilter = new RegExp(wordString, "gi");
    wordString = null;

    const findText = document.createExpression(".//text()[string-length() > 2 and not(parent::script or parent::code)]", null);


    // Initial slow filter pass that handles static text
    function filterStaticText()
    {
        let startTime, endTime;
        if (DEBUG)
        {
            startTime = performance.now();
        }

        // Do title first because it is always visible
        if (wordsFilter.test(document.title))
        {
            document.title = document.title.replace(wordsFilter, replaceString);
        }

        filterNodeTree(document.body);

        if (DEBUG)
        {
            endTime = performance.now();
            console.log("PF | Static Text Run-Time (ms): " + (endTime - startTime).toString());
        }
    }


    // --------------------


    // filters dynamic text, and handles things such as AJAX Youtube comments
    function filterDynamicText()
    {
        let textMutationObserver = new MutationObserver(filterMutations);
        let TxMOInitOps = { characterData: true, childList: true, subtree: true };
        textMutationObserver.observe(document.body, TxMOInitOps);

        let title = document.getElementsByTagName("title")[0];
        if (title)
        {
            let titleMutationObserver = new MutationObserver( function(mutations) { filterNode(title); } );
            let TiMOInitOps = { characterData: true, subtree: true };
            titleMutationObserver.observe(title, TiMOInitOps);
        }
    }


    // --------------------


    // Handler for mutation observer from filterDynamicText()
    function filterMutations(mutations)
    {
        let startTime, endTime;
        if (DEBUG)
        {
            startTime = performance.now();
        }

        for (let i = 0; i < mutations.length; ++i)
        {
            let mutation = mutations[i];

            if (mutation.type === "childList")
            {
                let nodes = mutation.addedNodes;
                for (let j = 0; j < nodes.length; ++j)
                {
                    filterNodeTree(nodes[j]);
                }
            }
            else if (mutation.type === "characterData" && !mutation.target.parentNode.isContentEditable)
            {
                filterNode(mutation.target);
            }
        }

        if (DEBUG)
        {
            endTime = performance.now();
            console.log("PF | Dynamic Text Run-Time (ms): " + (endTime - startTime).toString());
        }
    }


    // --------------------


    // Filters a textNode
    function filterNode(node)
    {
        if (wordsFilter.test(node.data))
        {
            node.data = node.data.replace(wordsFilter, replaceString);
        }
    }


    // --------------------


    // Filters all of the text from a node and its decendants
    function filterNodeTree(node)
    {
        if (!node || (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE))
        {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE)
        {
            filterNode(node);
            return; // text nodes don't have children
        }

        let textNodes = findText.evaluate(node, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        const l = textNodes.snapshotLength;
        for (let i = 0; i < l; ++i)
        {
            filterNode(textNodes.snapshotItem(i));
        }
    }


    // --------------------


    // Runs the different filter types
    function filterPage()
    {
        filterStaticText();
        filterDynamicText();
    }


    // --- MAIN -----------

    filterPage();

})();