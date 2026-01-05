// ==UserScript==
// @name        Unsounded Comment Redactor
// @namespace   http://localhost
// @description Redacts comments by individuals you no longer wish to hear from on the Unsounded comments page, and replaces them with quotes from Twin Peaks. I wrote this because of what a clusterfuck the comments section turned into near the end of chapter 9.
// @include     http://www.casualvillain.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4840/Unsounded%20Comment%20Redactor.user.js
// @updateURL https://update.greasyfork.org/scripts/4840/Unsounded%20Comment%20Redactor.meta.js
// ==/UserScript==


//This is the list of names you want to never hear from again. Case sensitive. 
//Place each name in double quotes, with a comma separating them (ie. ["Fred", "Wilma", "Barney"]). 
//If the name includes double quotes, simply put a backslash before each double-quote in the name (ie "The \"Rock\"" would read as 'The "Rock"')
var baddies = ["Example 1", "Example 2"]; 

//This is the variable that holds the list of all comments on the page. Don't touch this unless you know what you're doing.
var comments = getCommentList();

//Quotes are chosen at random from this list. If you aren't into Twin Peaks quotes, or otherwise want to add your own, change this big array. 
//Quotes should be in double quotation marks, and separated by commas. I leave a line between each quote, but this doesn't actually change anything, it just looks neater. 
//If there are double quotes within your chosen quotes, simply put a backslash before them. If you want to go to a new line, put in \n.
//The function will scale to however many quotes you put in so feel free to customize it to your heart's content!
function getQuote(number){
  var quote = ["Diane, 7:30 am, February twenty-fourth. Entering town of Twin Peaks. Five miles south of the Canadian border, twelve miles west of the state line. Never seen so many trees in my life. As W.C. Fields would say, I'd rather be here than Philadelphia. It's fifty-four degrees on a slightly overcast day. Weatherman said rain. If you could get paid that kind of money for being wrong sixty percent of the time it'd beat working.", 
              "Wanna know why I'm whittling? Because that's what you do in a town where a yellow light still means slow down and not speed up.", 
              "You know, this is — excuse me — a damn fine cup of coffee! … Now, I'd like two eggs, over hard. I know, don't tell me; it's hard on the arteries, but old habits die hard — just about as hard as I want those eggs.", 
              "Following a dream I had three years ago, I have become deeply moved by the plight of the Tibetan people, and have been filled with a desire to help them. I also awoke from the same dream realizing that I had subconsciously gained knowledge of a deductive technique, involving mind-body coordination operating hand-in-hand with the deepest level of intuition.", 
              "I've got good news. That gum you like is going to come back in style.", 
              "Nothing beats the taste sensation when maple syrup collides with ham.", 
              "One woman can make you fly like an eagle, another can give you the strength of a lion, but only one in the cycle of life can fill your heart with wonder and the wisdom that you have known a singular joy. I wrote that for my girlfriend.", 
              "Wednesdays were traditionally a school day when I was your age.", 
              "Harry, I’m going to let you in on a little secret. Every day, once a day, give yourself a present. Don’t plan it, don’t wait for it, just let it happen. It could be a new shirt at the men's store, a catnap in your office chair or two cups of good hot black coffee. Like this.", 
              "Ah, man that hits the spot. Nothing like a great cup of black coffee.", 
              "Diane, my recorder is on the table. I’m unable to reach it at this time. I can only hope that I inadvertently pressed the voice activation button. I’m lying on the floor of my room. I’ve been shot. There’s a great deal of pain and a fair amount of blood. Fortunately I was wearing my bulletproof vest last night per bureau regulations when working undercover. I remember folding the vest up trying to chase down a wood tick. If you can imagine the impact on your chest of three bowling balls dropped from the height of about nine feet, you might began to approximate the sensation", 
              "All things considered, being shot is not as bad as I always thought it might be. As long as you can keep the fear from your mind. But I guess you can say that about almost anything in life. Its not so bad as long as you can keep the fear from your mind.", 
              "Buddhist tradition first came to the land of snow in the fifth century AD. The first Tibetan king to be touched by the Dharma was King Hathatha Rignamputsan. He and succeeding kings were collectively known as the Happy Generations. Now some historians place them in the Water Snake Year, 213 AD. Others in the year of the water ox, 173 AD. Amazing isn’t it? The Happy Generations.", 
              "Agent Cooper, I am thrilled to pieces that the Dharma came to King Ho-Ho-Ho, I really am, but right now I’m trying hard to focus on the more immediate problems of our own century right here in Twin Peaks.", 
              "I, uh, performed the autopsy on Jacques Renault. Stomach contents revealed… let's see, beer cans, a Maryland license plate, half a bicycle tire, a goat… and a small wooden puppet. Goes by the name of Pinocchio.", 
              "You listen to me. While I will admit to a certain cynicism, the fact is that I am a naysayer and hatchet-man in the fight against violence. I pride myself in taking a punch and I'll gladly take another because I choose to live my life in the company of Gandhi and King. My concerns are global. I reject absolutely: revenge, aggression and retaliation. The foundation of such a method... is love. I love you Sheriff Truman.", 
              "Are you looking for secrets? Is that it? Maybe I can give you one. Do you want to know what the ultimate secret is? Laura did. The secret of knowing who killed you.", 
              "YOU ARE WITNESSING A FRONT THREE-QUARTER VIEW OF TWO ADULTS SHARING A TENDER MOMENT. Acts like he's never seen a kiss before.", 
              "Welcome to Twin Peaks. My name is Margaret Lanterman. I live in Twin Peaks. I am known as the Log Lady. There is a story behind that. There are many stories in Twin Peaks — some of them are sad, some funny. Some of them are stories of madness, of violence. Some are ordinary. Yet they all have about them a sense of mystery — the mystery of life. Sometimes, the mystery of death. The mystery of the woods. The woods surrounding Twin Peaks. To introduce this story, let me just say it encompasses the All — it is beyond the \"Fire\", though few would know that meaning. It is a story of many, but begins with one — and I knew her. The one leading to the many is Laura Palmer. Laura is the one.", 
              " I carry a log — yes. Is it funny to you? It is not to me. Behind all things are reasons. Reasons can even explain the absurd. Do we have the time to learn the reasons behind the human being's varied behavior? I think not. Some take the time. Are they called detectives? Watch — and see what life teaches.", 
              "Sometime ideas, like men, jump up and say 'hello'. They introduce themselves, these ideas, with words. Are they words? These ideas speak so strangely. All that we see in this world is based on someone's ideas. Some ideas are destructive, some are constructive. Some ideas can arrive in the form of a dream. I can say it again: some ideas arrive in the form of a dream.", 
              "There is a sadness in this world, for we are ignorant of many things. Yes, we are ignorant of many beautiful things — things like the truth. So sadness, in our ignorance, is very real. The tears are real. What is this thing called a tear? There are even tiny ducts — tear ducts — to produce these tears should the sadness occur. Then the day when the sadness comes — then we ask: \"Will this sadness which makes me cry — will this sadness that makes me cry my heart out — will it ever end?\" The answer, of course, is yes. One day the sadness will end.", 
              "Even the ones who laugh are sometimes caught without an answer: these creatures who introduce themselves but we swear we have met them somewhere before. Yes, look in the mirror. What do you see? Is it a dream, or a nightmare? Are we being introduced against our will? Are they mirrors? I can see the smoke. I can smell the fire. The battle is drawing nigh.", 
              "I play my part on my stage. I tell what I can to form the perfect answer. But that answer cannot come before all are ready to hear. So I tell what I can to form the perfect answer. Sometimes my anger at the fire is evident. Sometimes it is not anger, really. It may appear as such, but could it be a clue? The fire I speak of is not a kind fire.", 
              "Beauty is in the eye of the beholder. Yet there are those who open many eyes. Eyes are the mirror of the soul, someone has said. So we look closely at the eyes to see the nature of the soul. Sometimes when we see the eyes — those horrible times when we see the eyes, eyes that ... that have no soul — then we know a darkness, then we wonder: where is the beauty? There is none if the eyes are soulless.", 
              "A drunken man walks in a way that is quite impossible for a sober man to imitate, and vice versa. An evil man has a way, no matter how clever — to the trained eye, his way will show itself. Am I being too secretive? No. One can never answer questions at the wrong moment. Life, like music, has a rhythm. This particular song will end with three sharp notes, like deathly drumbeats.", 
              "Hello again. Can you see through a wall? Can you see through human skin? X-rays see through solid, or so-called solid objects. There are things in life that exist, and yet our eyes cannot see them. Have you ever seen something startling that others cannot see? Why are some things kept from our vision? Is life a puzzle? I am filled with questions. Sometimes my questions are answered. In my heart, I can tell if the answer is correct. I am my own judge. In a dream, are all the characters really you? Different aspects of you? Do answers come in dreams? One more thing: I grew up in the woods. I understand many things because of the woods. Trees standing together, growing alongside one another, providing so much. I chew pitch gum. On the outside, let's say of the ponderosa pine, sometimes pitch oozes out. Runny pitch is no good to chew. Hard, brittle pitch is no good. But in between there exists a firm, slightly crusted pitch with such a flavor. This is the pitch I chew.", 
              "As above, so below. The human being finds himself, or herself, in the middle. There is as much space outside the human, proportionately, as inside. Stars, moons, and planets remind us of protons, neutrons, and electrons. Is there a bigger being walking with all the stars within? Does our thinking affect what goes on outside us, and what goes on inside us? I think it does. Where does creamed corn figure into the workings of the universe? What really is creamed corn? Is it a symbol for something else?", 
              "Letters are symbols. They are building blocks of words which form our languages. Languages help us communicate. Even with complicated languages used by intelligent people, misunderstanding is a common occurrence. We write things down sometimes — letters, words — hoping they will serve us and those with whom we wish to communicate. Letters and words, calling out for understanding.", 
              "Miscommunication sometimes leads to arguments, and arguments sometimes lead to fights. Anger is usually present in arguments and fights. Anger is an emotion, usually classified as a negative emotion. Negative emotions can cause severe problems in our environment and to the health of our body. Happiness, usually classified as a positive emotion, can bring good health to our body, and spread positive vibrations into our environment. Sometimes when we are ill, we are not on our best behavior. By ill, I mean any of the following: physically ill, emotionally ill, mentally ill, and/or spiritually ill.", 
              "Sometimes nature plays tricks on us and we imagine we are something other than what we truly are. Is this a key to life in general? Or the case of the two-headed schizophrenic? Both heads thought the other was following itself. Finally, when one head wasn't looking, the other shot the other right between the eyes, and, of course, killed himself.", 
              "Sometimes we want to hide from ourselves — we do not want to be us — it is too difficult to be us. It is at these times that we turn to drugs or alcohol or behavior to help us forget that we are ourselves. This of course is only a temporary solution to a problem which is going to keep returning, and sometimes these temporary solutions are worse for us than the original problem. Yes, it is a dilemma. Is there an answer? Of course there is: as a wise person said with a smile: \"The answer is within the question.\"", 
              "A poem as lovely as a tree: \nAs the night wind blows, the boughs move to and fro. \nThe rustling, the magic rustling that brings on the dark dream. \nThe dream of suffering and pain. \nPain for the victim, pain for the inflicter of pain. \nA circle of pain, a circle of suffering. \nWoe to the ones who behold the pale horse.", 
              "Food is interesting. For instance, why do we need to eat? Why are we never satisfied with just the right amount of food to maintain good health and proper energy? We always seem to want more and more. When eating too much, the proper balance is disturbed and ill health follows. Of course, eating too little food throws the balance off in the opposite direction and there is the ill health coming at us again. Balance is the key. Balance is the key to many things. Do we understand balance? The word \"balance\" has seven letters. Seven is difficult to balance, but not impossible if we are able to divide. There are, of course, the pros and cons of division.'",
              "So now the sadness comes — the revelation. There is a depression after an answer is given. It was almost fun not knowing. Yes, now we know. At least we know what we sought in the beginning. But there is still the question: why? And this question will go on and on until the final answer comes. Then the knowing is so full, there is no room for questions.", 
              "Complications set in — yes, complications. How many times have we heard: 'it's simple'. Nothing is simple. We live in a world where nothing is simple. Each day, just when we think we have a handle on things, suddenly some new element is introduced and everything is complicated once again. What is the secret? What is the secret to simplicity, to the pure and simple life? Are our appetites, our desires undermining us? Is the cart in front of the horse?", 
              "Is life like a game of chess? Are our present moves important for future success? I think so. We paint our future with every present brush stroke. Painting. Colors. Shapes. Textures. Composition. Repetition of shapes. Contrast. Let nature guide us. Nature is the great teacher. Who is the principal? Sometimes jokes are welcome. Like the one about the kid who said: \"I enjoyed school. It was just the principal of the thing.\"", 
              "Is a dog man's best friend? I had a dog. The dog was large. It ate my garden, all the plants, and much earth. The dog ate so much earth it died. Its body went back to the earth. I have a memory of this dog. The memory is all that I have left of my dog. He was black — and white.", 
              "My husband died in a fire. No one can know my sorrow. My love is gone. Yet, I feel him near me. Sometimes I can almost see him. At night when the wind blows, I think of what he might have been. Again I wonder: why? When I see a fire, I feel my anger rising. This was not a friendly fire. This was not a forest fire. It was a fire in the woods. This is all I am permitted to say.", 
              "The heart — it is a physical organ, we all know. But how much more an emotional organ — this we also know. Love, like blood, flows from the heart. Are blood and love related? Does a heart pump blood as it pumps love? Is love the blood of the universe?", 
              "A death mask. Is there a reason for a death mask? It is barely a physical resemblance — in death, the muscles so relaxed, the face so without the animating spark. A death mask is almost an intrusion on a beautiful memory. And yet, who could throw away the casting of a loved one? Who would not want to study it longingly, as the distant freight train blows its mournful tone?", 
              "A hotel. A nightstand. A drawer pull on the drawer. A drawer pull of a nightstand in the room of a hotel. What could possibly be happening on or in this drawer pull? How many drawer pulls exist in this world? Thousands, maybe millions. What is a drawer pull? This drawer pull — why is it featured so prominently in a life or in a death of one woman who was caught in a web of power? Can a victim of power end in any way connected to a drawer pull? How can this be?", 
              "Sometimes — well, let's say all times — things are changing. We are judged as human beings on how we treat our fellow human beings. How do you treat your fellow human beings? At night, just before sleep, as you lay by yourself in the dark, how do you feel about yourself? Are you proud of your behavior? Are you ashamed of your behavior? You know in your heart if you have hurt someone — you know. If you have hurt someone, don't wait another day before making things right. The world could break apart with sadness in the meantime.", 
              "The beautiful thing about treasure is that it exists. It exists to be found. How beautiful it is to find treasure. Where is the treasure, that when found, leaves one eternally happy? I think we all know it exists. Some say it is inside us — inside us one and all. That would be strange. It would be so near. Then why is it so hard to find, and so difficult to attain?", 
              "Pie. Whoever invented the pie? Here was a great person. In Twin Peaks, we specialize in cherry pie and huckleberry pie. We do have many other types of pie, and at the Double R Diner, Norma knows how to make them all better than anyone I have ever known. I hope Norma likes me. I know I like her and respect her. I have spit my pitch gum out of my mouth onto her walls and floors and sometimes onto her booths. Sometimes I get angry and do things I'm not proud of. I do love Norma's pies. I love pie with coffee.", 
              "There are clues everywhere — all around us. But the puzzle maker is clever. The clues, although surrounding us, are somehow mistaken for something else. And the something else — the wrong interpretation of the clues — we call our world. Our world is a magical smoke screen. How should we interpret the happy song of the meadowlark, or the robust flavor of a wild strawberry?", 
              "A log is a portion of a tree. At the end of a crosscut log — many of you know this — there are rings. Each ring represents one year in the life of the tree. How long it takes to a grow a tree! I don't mind telling you some things. Many things I, I musn't say. Just notice that my fireplace is boarded up. There will never be a fire there. On the mantelpiece, in that jar, are some of the ashes of my husband. My log hears things I cannot hear. But my log tells me about the sounds, about the new words. Even though it has stopped growing larger, my log is aware.",
              "And now, an ending. Where there was once one, there are now two. Or were there always two? What is a reflection? A chance to see two? When there are chances for reflections, there can always be two — or more. Only when we are everywhere will there be just one. It has been a pleasure speaking to you."];
  return quote[Math.round(number*quote.length)];
}

// -----------------------------DO NOT CHANGE ANYTHING BELOW THIS POINT UNLESS YOU KNOW WHAT YOU'RE DOING--------------------------------------------------------------------

//This function gets a list of all comments on the page. I gave it its own function in case I wanted to do anything weird with it later.
function getCommentList(){
  return document.getElementsByTagName("li");
}

//This function replaces the offending comment's name field with a big REDACTED
function redactName(comment){
  comment.childNodes[3].innerHTML = "<strong>REDACTED</strong>";
}

//This function retrieves a random quote using getQuote(), and then replaces the text of the offending comment with it.
function redactComment(comment){
  comment.childNodes[1].innerHTML = getQuote(Math.random());
}

//This function checks the name field of the provided comment against all the people you've blacklisted
function checkForBaddies(comment){
  for (var i = 0; i < baddies.length; i++){
    if (comment.childNodes[3].innerHTML.search(baddies[i]) != -1){
      return true;
    }
  }
  return false;
}


for (var i = 0; i < comments.length; i++){
  if (checkForBaddies(comments[i])==true) {
    redactName(comments[i]);
    redactComment(comments[i]);
  }
}
  
