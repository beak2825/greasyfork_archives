var _username = "";
var _message1 = "";
var _message2 = "";
var _message3 = "";
var _message4 = "";
var _message5 = "";

function _AI(id_message)
{
	switch (id_message) 
	{
		case 'hello':
			id_object = [
			    'Hello', 'Hi', 'What’s up?', 'Whats up?', 'How’s it going?', 'How’s it going','Hows it going',
			    'What’s happening', 'Yo', 'Yo! sup', 'who is there?', 'hey boo', 'how you doin', 'ello mate',
			    'you know who this is', 'here is me', 'here`s me','sup dude', 'hi mate', 'hello dude', 'sup dude',
			    'whats up mate', 'good day', 'how are you'
			];
		break;

		case 'female':
			id_object = [
			    'f here and you?', 'female', 'woman and you?', 'F here you??', 'girl here', 'f and you','babe girl and you',
			    'i am f and you', 'i`m woman', 'f here what about you'
			];
		break;

		case 'add':
			id_object = [
			    'add me on', 'See you there', 'waiting for you there', 'just waiting to add you on', 
			    'find me on', 'see me on','did you added on', 'lets go to', 'lets talk on', 'wanna talk on',
			    'here my', 'there on', 'this is my', 'go to', 'see my pics on', 'wanna pictures? go to',
			    'share some pics? on', 'more private on', 'lets get private my'
			];
		break;

		case 'snap':
			id_object = [
			    'snapchat', 'snap'
			];
		break;
	}

	var randID = Math.floor( Math.random() * id_object.length );
	return id_object[randID];
}

function messageUser(machinne)
{
    _message1 = _AI('hello');
	_message2 = _AI('female');
	_message3 = _AI('add');
	_message4 = _AI('snap');
	_message5 = "";

    switch(machinne)
    {
    	// --------------------
        case 'b0':
            _username = "mbeIliza";
        break;
        // ...

		// --------------------
        case 'b1':
            _username = "mbeIIiza";
        break;
        // ...

        // --------------------
        case 'b2':
            _username = "hannaIle9";
        break;
        // ...

        // --------------------
        case 'b3':
            _username = "hannaIIe9";
        break;
        // ...

        // --------------------
        case 'b4':
            _username = "karoIlinx4";
        break;
        // ...

        // --------------------
        case 'b5':
            _username = "karoIIinx4";
        break;
        // ...

        // --------------------
        case 'b6':
            _username = "elaforte9";
        break;
        // ...  
    }
}