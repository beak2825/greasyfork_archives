// ==UserScript==
// @name         Speciální testová operace
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  My to dokazeme !!
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463188/Speci%C3%A1ln%C3%AD%20testov%C3%A1%20operace.user.js
// @updateURL https://update.greasyfork.org/scripts/463188/Speci%C3%A1ln%C3%AD%20testov%C3%A1%20operace.meta.js
// ==/UserScript==

(function() {
  const divElement = document.createElement("div");
      divElement.setAttribute("id", "definitelynotcheating");
      divElement.style.display = "none";
      divElement.style.position = "fixed";
      divElement.style.bottom = "10px";
      divElement.style.right = "10px";
      divElement.style.maxWidth = "500px";
      divElement.style.maxHeight = "500px";
      divElement.style.overflow = "auto";
      divElement.style.background = "white";
      divElement.style.padding="10px"
    divElement.style.color="black"
      // Add the div element to the document body
      document.body.appendChild(divElement);

      let show = false;
      let counter = 0;
      const texts = [
  "<h3>Sablony</h3>\n<ul>\n    <li><%- include(\"../partials/flash\") %></li>\n    <li><%= comment.comment%></li>\n</ul>\n\n",
  "<h3>Model</h3>\n<pre>\n    const CommentSchema = new Schema({\n        title: {\n          type: String,\n          required: true,\n        },\n        comment: {\n          type: String,\n          required: true,\n        },\n        author: {\n          type: Schema.Types.ObjectId,\n          ref: 'User',\n        }\n      });\n\n\n      module.exports = mongoose.model('Comment', CommentSchema);\n</pre>\n</ul>",
  "<h3>Error handler</h3>\n<pre>\n    app.use((err, req, res, next) => {\n        const { statusCode = 500 } = err;\n        if (!err.message) {\n          err.message = 'Something went wrong';\n        }\n        res.status(statusCode).render('error', { err });\n      });\n</pre>",
  "<h3>404</h3>\n<pre>app.all('*', (req, res, next) => {\n    const err = new ExpressError('Page not found', 404);\n    next(err);\n  });</pre>",
  "<h3>if</h3>\n<pre>\n    <% if (currentUser && currentUser._id.equals(comment.author._id)) { %>\n    <br>\n    <% } %>\n</pre>",
  "<h3>for</h3>\n<pre>\n    <% for (let c of comments) { %>\n    <br>\n    <% } %>\n</pre>",
  "<h3>router</h3>\n<pre>\napp.use('/comments', commentsRouter);\n\n\nrouter.get('/register', (req, res) => {\n    res.render('users/register');\n});\n  \nrouter.post('/register',\n    catchAsync(async (req, res, next) => {\n      try {\n        const { username, email, password } = req.body;\n        const user = new User({ username, email });\n        const registeredUser = await User.register(user, password);\n        req.login(registeredUser, (err) => {\n          if (err) return next(err);\n          req.flash('success', 'Welcome to Comments app');\n          res.redirect('/comments');\n        });\n      } catch (error) {\n        req.flash('error', error.message);\n        res.redirect('register');\n      }\n    })\n);\n  \nrouter.get('/login', (req, res) => {\n    res.render('users/login');\n});\n\n\nrouter.get(\n  '/:id/edit',\n  isLoggedIn,\n  isAuthor,\n  catchAsync(async (req, res) => {\n    const { id } = req.params;\n    const comment = await Comment.findById(id);\n    if (!comment) {\n      req.flash('error', 'Comment not found');\n      return res.redirect('/comments');\n    }\n    res.render('comments/edit', { comment });\n  })\n);\n</pre>"
];
      const notCheatingDOM = document.querySelector("#definitelynotcheating");

 

      notCheatingDOM.innerHTML = texts[0];

      document.body.addEventListener("keypress", e => {
        const key = e.key;
        if (key === "ě") {
          notCheatingDOM.innerHTML = texts[counter = (++counter % texts.length)];
        }

        if (key === "š") {
            counter--;
            if (counter < 0) {
                counter = texts.length - 1;
            }
          notCheatingDOM.innerHTML = texts[counter];
        }

        if (key === "č") {
          notCheatingDOM.style.display = show ? "none" : "block";
          show = !show;
        }
      });

    // Your code here...
})();